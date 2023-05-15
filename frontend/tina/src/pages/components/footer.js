import NextLink from "next/link";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer
      className="bg-dark text-light py-3"
      style={{ bottom: 0, left: 0, width: "100%" }}
    >
      <Container>
        <Row className="align-items-center">
          {/* Column for the general conditions link */}
          <Col md={4} className="text-center mb-3 mb-md-0">
            {/* Create a Next.js Link for the general conditions page */}
            <NextLink
              href="/conditions-generales"
              passHref
              style={{ textDecoration: "none" }}
            >
              {/* Style the link with a hover effect and a pointer cursor */}
              <span
                className="text-muted text-decoration-none hover:text-light cursor-pointer"
                style={{ textDecoration: "none", transition: "color 0.2s" }}
              >
                Conditions générales
              </span>
            </NextLink>
          </Col>
          {/* Column for the copyright information */}
          <Col md={4} className="text-center mb-3 mb-md-0">
            <p className="mb-1 text-muted" style={{ color: "#a1a1a1" }}>
              © 2023 Tina coiffure. Tous droits réservés.
            </p>
          </Col>
          {/* Column for the social media icons */}
          <Col md={4} className="text-center">
            {/* Instagram icon with a link to the Instagram profile */}
            <a
              href="https://www.instagram.com/tina_coiffure/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white me-3"
            >
              <Image
                src="/images/instagram_logo.svg"
                alt="instagram"
                width={30}
                height={30}
              />
            </a>
            {/* Facebook icon with a link to the Facebook profile */}
            <a
              href="https://www.facebook.com/tinacoiffure1205/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <Image
                src="/images/facebook_logo.svg"
                alt="facebook"
                width={30}
                height={30}
              />
            </a>
          </Col>
        </Row>
      </Container>
      {/* Apply custom CSS for the hover effect on the general conditions link */}
      <style jsx global>{`
        .hover\:text-light:hover {
          color: #f8f9fa !important;
        }
      `}</style>
    </footer>
  );
}
