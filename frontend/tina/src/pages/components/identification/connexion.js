import { useState } from "react";
import Header from "../header";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import { useRouter } from "next/router";
import { setCookie } from "nookies";

/**
 * @namespace 'connexion.js'
 * @description This component provides the functionality to log in to the application.
 * @returns {JSX.Element} A React functional component rendering the login interface.
 */
export default function Connexion() {

  /**
   * @constant router
   * @memberof 'connexion.js'
   * @see {@link 'header.js'.router}
   */
  const router = useRouter();

  /**
   * @constant user
   * @memberof 'connexion.js'
   * @description This state variable stores the user's data.
   * @property {string} username The user's username.
   * @property {string} password The user's password.
   * @default {username: "", password: ""}
   */
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  /**
   * @function handleSubmit
   * @memberof 'connexion.js'
   * @description This function handles the login form submission.
   * @param {object} evt The event object.
   */
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const data = await response.json();
      setCookie(null, "id", data.id, { maxAge: 86400, path: "/" });
      setCookie(null, "csrftoken", data.token, { maxAge: 86400, path: "/" });
      setCookie(null, "email", data.email, { maxAge: 86400, path: "/" });
      setCookie(null, "username", data.username, { maxAge: 86400, path: "/" });
      setCookie(null, "last_name", data.last_name, {
        maxAge: 86400,
        path: "/",
      });
      setCookie(null, "first_name", data.first_name, {
        maxAge: 86400,
        path: "/",
      });
      setCookie(null, 'role', data.role, { maxAge: 86400, path: '/' });
      router.push("/");
    } else {
      alert("Identifiants incorrects");
    }
  };

  const handleChange = (evt) => {
    setUser({ ...user, [evt.target.dataset.id]: evt.target.value });
  };

  return (
      <>
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh", backgroundColor: "#b8aaa0" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-sm-10 col-md-8 col-lg-6">
                <Card
                    className="border-0"
                    style={{ backgroundColor: "#b8aaa0", marginTop: "-150px" }}
                >
                  <Card.Body>
                    <Card.Title className="text-center mb-4">
                      <div className="d-flex justify-content-center align-items-center" style={{gap: "10px", fontFamily: "Abhaya Libre", fontSize: "38px", fontWeight: "bold"}}>
                        <img src="/images/tina_logo.png" className="shadow" width="50" alt="logo" />
                        <h2>Tina Coiffure</h2>
                      </div>
                    </Card.Title>

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control
                            data-id="username"
                            value={user.username}
                            type="text"
                            placeholder="Nom d'utilisateur"
                            onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            data-id="password"
                            value={user.password}
                            type="password"
                            placeholder="Mot de passe"
                            onChange={handleChange}
                        />
                        <Form.Text className="text-muted">
                          <Link class="nav-link" href="/">
                            Problème de connexion ?
                          </Link>
                        </Form.Text>
                      </Form.Group>
                      <Button
                          variant="primary"
                          type="submit"
                          className='w-100 border-0"'
                          style={{ backgroundColor: "#232627", border: 0 }}
                      >
                        Se connecter
                      </Button>
                      <Form.Text className="text-muted">
                        <Link
                            class="nav-link"
                            href="/components/identification/inscription"
                        >
                          Vous n'avez pas de compte ?
                        </Link>
                      </Form.Text>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}
