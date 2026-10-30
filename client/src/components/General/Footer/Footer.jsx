import logoLearnix from "../../../assets/logo-learnix1.png";
import "./Footer.css";

function Footer() {
return (
<footer className="learnix-footer">
<div className="footer-content">
<a href="/" className="footer-brand">
<img src={logoLearnix} alt="Logo de Learnix" className="footer-brand-logo" />
<span>Learnix</span>
</a>

    <div className="footer-contact">
      <h3>Contactanos</h3>

      <div className="footer-contact-list">
        <a href="mailto:inmanagecompany@gmail.com">
          <span className="footer-contact-icon">✉</span>
          inmanagecompany@gmail.com
        </a>

        <a href="tel:+5491124695226">
          <span className="footer-contact-icon">☎</span>
          +54 9 11 2469-5226
        </a>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Av.+Jujuy+255%2C+Balvanera%2C+Argentina"
          target="_blank"
          rel="noreferrer"
        >
          <span className="footer-contact-icon">⌖</span>
          Av. Jujuy 255, Balvanera, Argentina
        </a>

        <a
          href="https://www.instagram.com/inmamanage_company/"
          target="_blank"
          rel="noreferrer"
        >
          <span className="footer-contact-icon">◎</span>
          @inmamanage_company
        </a>
      </div>
    </div>

    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} Learnix</span>

      <span className="footer-developed">
        Desarrollado por <strong>Inmanage</strong>
      </span>

      <a href="/" className="footer-home">
        Volver al inicio <span>↑</span>
      </a>
    </div>
  </div>
</footer>

);
}

export default Footer;