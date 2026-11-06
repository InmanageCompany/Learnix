import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const POLL_INTERVAL = 30000;
const MAX_NOTIFICATIONS = 30;

function readStoredValue(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`No se pudo leer el estado guardado de Learnix (${key}).`, error);
    return fallback;
  }
}

function useGradeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [checkingError, setCheckingError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return undefined;

    let studentId;

    try {
      studentId = jwtDecode(token).id;
    } catch (error) {
      console.error("No se pudo identificar al estudiante para revisar sus notas.", error);
      setCheckingError("No se pudieron revisar las notas de esta sesión.");
      return undefined;
    }

    if (studentId == null) {
      setCheckingError("No se pudo identificar al estudiante para revisar sus notas.");
      return undefined;
    }

    const snapshotKey = `learnix:student:${studentId}:grade-snapshot`;
    const notificationsKey = `learnix:student:${studentId}:grade-notifications`;
    const savedNotifications = readStoredValue(notificationsKey, []);
    setNotifications(Array.isArray(savedNotifications) ? savedNotifications : []);

    let active = true;
    let checking = false;
    let controller;

    const checkGrades = async () => {
      if (!active || checking || document.visibilityState === "hidden") return;
      checking = true;
      controller = new AbortController();

      try {
        const headers = { Authorization: token };
        const reportsResponse = await axios.get(
          "http://localhost:3000/api/student/reportCards",
          { headers, signal: controller.signal }
        );

        if (!Array.isArray(reportsResponse.data)) {
          throw new Error("La respuesta de boletines no tiene el formato esperado.");
        }

        const reports = reportsResponse.data;
        const gradeResponses = await Promise.all(
          reports.map((report) =>
            axios.get(
              `http://localhost:3000/api/student/notes/${report.id}`,
              { headers, signal: controller.signal }
            )
          )
        );

        if (!active) return;

        const currentSnapshot = {};
        gradeResponses.forEach((response, reportIndex) => {
          if (!Array.isArray(response.data)) {
            throw new Error("La respuesta de calificaciones no tiene el formato esperado.");
          }

          const report = reports[reportIndex];
          response.data.forEach((grade) => {
            const key = `${report.id}:${grade.id}`;
            currentSnapshot[key] = {
              id: grade.id,
              reportCardId: report.id,
              period: report.period?.name || "Boletín",
              subject: grade.subject?.name || "Materia",
              gradeValue: grade.grade_value,
              comment: grade.comment || "",
            };
          });
        });

        const previousSnapshot = readStoredValue(snapshotKey, null);
        const hasPreviousSnapshot = previousSnapshot !== null
          && typeof previousSnapshot === "object"
          && !Array.isArray(previousSnapshot);
        const newNotifications = [];

        if (hasPreviousSnapshot) {
          Object.entries(currentSnapshot).forEach(([key, currentGrade]) => {
            const previousGrade = previousSnapshot[key];
            if (!previousGrade) {
              newNotifications.push({
                id: `${key}:added:${encodeURIComponent(String(currentGrade.gradeValue))}`,
                reportCardId: currentGrade.reportCardId,
                title: "Nueva nota cargada",
                message: `${currentGrade.subject} · ${currentGrade.period}: ${currentGrade.gradeValue}.`,
                createdAt: new Date().toISOString(),
                read: false,
              });
              return;
            }

            const gradeChanged = previousGrade.gradeValue !== currentGrade.gradeValue;
            const commentChanged = previousGrade.comment !== currentGrade.comment;
            if (!gradeChanged && !commentChanged) return;

            const changeId = encodeURIComponent(JSON.stringify([
              previousGrade.gradeValue,
              currentGrade.gradeValue,
              previousGrade.comment,
              currentGrade.comment,
            ]));

            newNotifications.push({
              id: `${key}:changed:${changeId}`,
              reportCardId: currentGrade.reportCardId,
              title: gradeChanged ? "Nota modificada" : "Observación actualizada",
              message: gradeChanged
                ? `La nota de ${currentGrade.subject} en ${currentGrade.period} cambió de ${previousGrade.gradeValue} a ${currentGrade.gradeValue}.`
                : `Se actualizó la observación de ${currentGrade.subject} en ${currentGrade.period}.`,
              createdAt: new Date().toISOString(),
              read: false,
            });
          });
        }

        if (newNotifications.length > 0) {
          const storedNotifications = readStoredValue(notificationsKey, []);
          const existing = Array.isArray(storedNotifications) ? storedNotifications : [];
          const existingIds = new Set(existing.map((notification) => notification.id));
          const merged = [
            ...newNotifications.filter((notification) => !existingIds.has(notification.id)),
            ...existing,
          ].slice(0, MAX_NOTIFICATIONS);

          try {
            localStorage.setItem(notificationsKey, JSON.stringify(merged));
          } catch (error) {
            console.error("No se pudieron guardar las notificaciones de notas.", error);
          }
          setNotifications(merged);
        }

        try {
          localStorage.setItem(snapshotKey, JSON.stringify(currentSnapshot));
        } catch (error) {
          console.error("No se pudo guardar la última consulta de notas.", error);
        }

        setCheckingError("");
      } catch (error) {
        if (!active || axios.isCancel(error)) return;
        console.error("No se pudieron comprobar los cambios en las notas.", error);
        if (error.response)
          setCheckingError(error.response.data.message || "No se pudieron revisar las notas.");
        else if (error.request)
          setCheckingError("No hay respuesta del servidor al revisar las notas.");
        else
          setCheckingError(error.message || "No se pudieron revisar las notas.");
      } finally {
        checking = false;
      }
    };

    const checkWhenVisible = () => {
      if (document.visibilityState === "visible") checkGrades();
    };

    checkGrades();
    const intervalId = window.setInterval(checkGrades, POLL_INTERVAL);
    document.addEventListener("visibilitychange", checkWhenVisible);

    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, []);

  const markAsRead = useCallback((notificationId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const studentId = jwtDecode(token).id;
      if (studentId == null) return;

      const notificationsKey = `learnix:student:${studentId}:grade-notifications`;
      const storedNotifications = readStoredValue(notificationsKey, []);
      const current = Array.isArray(storedNotifications) ? storedNotifications : [];
      const updated = current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );

      localStorage.setItem(notificationsKey, JSON.stringify(updated));
      setNotifications(updated);
    } catch (error) {
      console.error("No se pudo marcar la notificación como leída.", error);
    }
  }, []);

  return { notifications, checkingError, markAsRead };
}

export default useGradeNotifications;
