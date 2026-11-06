// ===================== Importaciones =====================
const { Binnacle, models } = require('../models');


async function BitacoraMiddleware(req, res) {
    //res.on('finish', async () => {   //esto se va usar para hacerlo de otra manera en caso de que se quiera
    try {
        //acordions
        const method = req.method.toLowerCase();
        const table = req.table;
        const facts = req.facts || {};
        const old_value = req.old_value || {};
        const result = req.result || {};

        console.log(req.user.id)

        const filtered = Object.fromEntries(
            Object.entries(old_value).filter(([key]) =>
                facts && Object.keys(facts).includes(key)
            )
        );


        let payload = {
            responsible_id: req.user.id,
            table: table,
            action: method
        };

        payload.entity_id = (
            method == "post" || method == "delete"
                ? facts.id
                : method == "put"
                    ? old_value.id
                    : result.id
        )

        payload.facts = Object.keys(facts).length === 0
            ? JSON.stringify(Object.keys(result))
            : JSON.stringify(Object.keys(facts));

        payload.old_value = (
            method == "put"
                ? JSON.stringify(filtered)
                : method == "delete"
                    ? JSON.stringify(facts)
                    : null
        )

        payload.new_value = (
            method === "put" || method === "post"
                ? JSON.stringify(facts)
                : method === "get"
                    ? JSON.stringify(result)
                    : null
        );

        await Binnacle.create(payload);
        console.log("Insercion en bitacora exitosa");

        return res.json(result);

    } catch (err) {
        console.error("Error en bitácora:", err);
        return res.status(500).json({ message: 'Error al registrar bitácora', error: err.message });
    }
}
//)}
async function Prepare_bitacora(req, res, next) {
    try {
        const table_name = req.table;
        const method = req.method.toLowerCase();
        const create = req.create; // Lo manda el controlador POST, porque Prepare va después
        const { idD } = req.params || {};
        const { idU } = req.body || {};

        const model = models[table_name];
        if (!model) return res.json({ message: `No existe el modelo Sequelize '${table_name}'` });

        let facts;
        const verif =
            method === "delete"
                ? idD
                : method === "put"
                    ? (idU || req.user.id)
                    : null;

        if (verif) {
            const record = await model.findByPk(verif);
            if (!record) return res.json({ message: `Registro no encontrado en '${table_name}' con ID ${verif}` });

            const data = record.toJSON();
            delete data.password; // la contraseña nunca va a la bitácora

            if (method == "put") {
                req.old_value = data;
                req.verif = verif;
            }
            else facts = data;
        }

        if (method == "post") {
            // Acepta una instancia de Sequelize o un objeto plano
            facts = typeof create?.toJSON === "function" ? create.toJSON() : create;
        }

        req.facts = facts || {};
        next();
    } catch (err) {
        console.error("Error en Prepare_bitacora:", err);
        return res.status(500).json({ message: 'Error al preparar la bitácora', error: err.message });
    }
}

// ===================== Exportaciones =====================
module.exports = {
    BitacoraMiddleware,
    Prepare_bitacora
}