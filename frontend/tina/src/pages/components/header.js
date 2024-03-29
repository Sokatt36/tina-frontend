import { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import Cookies from "js-cookie";


/**
 * @namespace 'header.js'
 * @description This Header component is used to generate the application's navigation bar.
 * It contains links for navigating through the application and functionality for user authentication.
 * @returns {JSX.Element} The Header component as a JSX element.
 */
function Header() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    /**
     * @constant user
     * @memberof 'header.js'
     * @description State variable holding the currently logged-in user's information.
     * @default {{email: "", username: "", last_name: "", first_name: ""}}
     * @property {string} email - The authenticated user's email address.
     * @property {string} username - The authenticated user's username.
     * @property {string} last_name - The authenticated user's last name.
     * @property {string} first_name - The authenticated user's first name.
     */
    const [user, setUser] = useState({
        email: "",
        username: "",
        last_name: "",
        first_name: "",
    });

    /**
     * @constant token
     * @memberof 'header.js'
     * @description State variable holding the currently logged-in user's authentication token.
     * @default null
     */
    const [token, setToken] = useState(null);

    /**
     * @constant router
     * @memberof 'header.js'
     * @description Router object from Next.js' useRouter hook for programmatic navigation.
     */
    const router = useRouter();

    /**
     * @constant cookies
     * @memberof 'header.js'
     * @type {object}
     * @description An object containing all of the user's cookies.
     */
    const cookies = parseCookies();

    /**
     * @function useEffect
     * @memberof 'header.js'
     * @description This useEffect hook sets the token and user's information based on the cookies when the component mounts or updates.
     * @returns {void}
     */
    useEffect(() => {
        setToken(cookies.csrftoken);

        if (token) {
            setUser({
                email: cookies.email,
                username: cookies.username,
                last_name: cookies.last_name,
                first_name: cookies.first_name,
            });
        }
    }, [token]);

    /**
     * @function handleLogout
     * @memberof 'header.js'
     * @description This function handles the user's logout process. It removes all user and session cookies and redirects to the home page.
     * @returns {void}
     */
    const handleLogout = async () => {

        const response = await fetch(baseUrl + "logout/", {
            method: "POST",
            headers: {
                "Authorization": "Token " + cookies.csrftoken,
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            Cookies.remove("id");
            Cookies.remove("csrftoken");
            Cookies.remove("email");
            Cookies.remove("username");
            Cookies.remove("last_name");
            Cookies.remove("first_name");
            Cookies.remove("role");
            await router.push("/");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            Cookies.remove("id");
            Cookies.remove("csrftoken");
            Cookies.remove("email");
            Cookies.remove("username");
            Cookies.remove("last_name");
            Cookies.remove("first_name");
            Cookies.remove("role");
            await router.push("/");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    return (
        <>
            <style type="text/css">
                {`
            .navbar {
                background-color: #232627;
                color: #fff;
                min-height: 90px;
            }
        `}
            </style>
            <header style={{ position: "fixed", width: "100%", top: "0", zIndex: "100" }}>
                <Navbar collapseOnSelect expand="lg" variant="dark">
                    <Navbar.Brand href="/"
                                  style={{
                                      marginLeft: "6%",
                                      display: 'flex', /* Ajout de la propriété display: flex */
                                      alignItems: 'center', /* Alignement des éléments sur la ligne de base */
                                      gap: '10px' /* Espacement entre l'image et le texte */
                                  }}
                    >
                        <img src="/images/tina_logo.png" className="d-inline-block align-top rounded-circle shadow" width="60" alt="Logo Tina Coiffure" />
                        <h4  style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            textDecoration: "none",
                            textShadow: "2px 2px 4px #000000"
                        }}>Tina Coiffure</h4>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto" style={{ marginRight: "6%" }}>
                            <Nav.Link href="/">Accueil</Nav.Link>
                            {token && cookies.role === "admin" && (
                                <Nav.Link href="/components/gestion_admin/dash_admin">
                                    Administration
                                </Nav.Link>
                            )}
                            {token && cookies.role === "employee" && (
                                <Nav.Link href="/components/CRUD_encaissement/creation_encaissement">
                                    Encaissement
                                </Nav.Link>
                            )}
                            {token && cookies.role === "admin" && (
                                <Nav.Link href="/components/CRUD_encaissement/creation_encaissement">
                                    Encaissement
                                </Nav.Link>
                            )}
                            <Nav.Link href="/components/prise_rendez_vous/service_rdv">
                                {(token && (cookies.role === "admin" || cookies.role === "employee")) ? "Planifier un rendez-vous client" : "Prendre rendez-vous"}
                            </Nav.Link>
                            {token ? (
                                <NavDropdown title={user.username} id="collasible-nav-dropdown">
                                    <NavDropdown.Item href="/components/CRUD_utilisateur/profil_utilisateur">
                                        Mon profil
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/components/CRUD_utilisateur/calendrier_utilisateur">
                                        Mes rendez-vous
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={handleLogout}>
                                        Se déconnecter
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link href="/components/identification/connexion">
                                    S'identifier
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>{" "}
            <br />
            <br />
            <br />
        </>
    );
}

export default Header;
