import { useState, useEffect } from "react";
import Header from "../header";
import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useRouter } from "next/router";
import Footer from "../footer";
import Cookies from 'js-cookie';
import {Modal, Button} from 'react-bootstrap';

/**
 * @namespace 'profil_utilisateur.js'
 * @description This component manages the profile information of the user. It enables profile viewing, modification, and deletion.
 * @returns {JSX.Element} The JSX code for the user profile component.
 */

export default function ProfilUtilisateurs() {

  /**
   * @memberof 'detail_rdv.js'
   * @constant {object} show
   * @description state to show the modal
   * @default false
   */
  const [show, setShow] = useState(false);

  /**
   * @memberof 'detail_rdv.js'
   * @function handleClose
   * @description set the state show to false
   */
  const handleClose = () => setShow(false);

  /**
   * @memberof 'detail_rdv.js'
   * @function handleShow
   * @description set the state show to true
   */
  const handleShow = () => setShow(true);

  /**
   * @memberof 'detail_rdv.js'
   * @constant {String} baseUrl
   * @description variable to store the base of the url of the API
   * @default process.env.NEXT_PUBLIC_BASE_URL
   */
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  /**
   * @constant customer
   * @default
   * @type {object}
   * @memberof 'profil_utilisateur.js'
   * @description Represents the authenticated user's information. This state variable stores the username, email, and the first and last name of the user.
   * @default {{email: "", username: "", last_name: "", first_name: ""}}
   * @property {string} username - The authenticated user's username.
   * @property {string} email - The authenticated user's email address.
   * @property {string} first_name - The authenticated user's first name.
   * @property {string} last_name - The authenticated user's last name.
   */
  const [customer, setCustomer] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  /**
   * @constant cookies
   * @memberof 'profil_utilisateur.js'
   * @see {@link 'header.js'.cookies}
   */
  const cookies = parseCookies();

  /**
   * @constant router
   * @memberof 'profil_utilisateur.js'
   * @see {@link 'header.js'.router}
   */
  const router = useRouter();

  /**
   * @constant token
   * @memberof 'profil_utilisateur.js'
   * @see {@link 'header.js'.token}
   */
  const [token, setToken] = useState(null);

  /**
   * @constant role
   * @default null
   * @type {string}
   * @memberof 'profil_utilisateur.js'
   * @description Represents the authenticated user's role. This can be either 'customer', 'employee' or 'admin'.
   * @example "customer"
   */
  const [role, setRole] = useState(null);

  /**
   * @function fetchCusto
   * @async
   * @memberof 'profil_utilisateur.js'
   * @description Retrieves the profile information of the authenticated user if the user's role is 'customer'. The data is fetched from the server.
   * @returns {void}
   */
  const fetchCusto = async () => {
    try {
      const response = await axios.get(
          baseUrl + "customers/" + cookies.id + "/",
          {
            headers: {
              Authorization: "Token " + cookies.csrftoken,
            },
          }
      );
      setCustomer(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @function fetchEmp
   * @async
   * @memberof 'profil_utilisateur.js'
   * @description Retrieves the profile information of the authenticated user if the user's role is 'employee' or 'admin'. The data is fetched from the server.
   * @returns {void}
   */
  const fetchEmp = async () => {
    try {
      const response = await axios.get(
          baseUrl + "employees/" + cookies.id + "/",
          {
            headers: {
              Authorization: "Token " + cookies.csrftoken,
            },
          }
      );
      setCustomer(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @function useEffect
   * @returns {void}
   * @memberof 'profil_utilisateur.js'
   * @description Sets the token and user information when the component is first mounted. If the role of the user is 'customer', it fetches customer data; if the role is 'employee' or 'admin', it fetches employee data.
   */
  useEffect(() => {
    setToken(cookies.csrftoken);
    setRole(cookies.role);
    if (cookies.role === "customer") {
      fetchCusto();
    } else if (cookies.role === "employee" || cookies.role === "admin") {
      fetchEmp();
    }
  }, []);

  const handleChange = (evt) => {
    setCustomer({ ...customer, [evt.target.dataset.id]: evt.target.value });
  };

  /**
   * @function submitCusto
   * @async
   * @description This function submits the updated information of the logged-in user if the user is a customer. It does so by making an HTTP PATCH request to the relevant endpoint. If the password is being updated, it ensures that the new password and the confirmation password match. In case of a successful response, it updates the relevant cookies and redirects the user to the home page. If the passwords do not match, it alerts the user.
   * @param {object} evt - The submit event from the form.
   * @memberof 'profil_utilisateur.js'
   * @returns {void}
   */
  const submitCusto = (evt) => {
    evt.preventDefault();
    console.log(customer);
    if (customer.password !== "") {

      if (customer.password === customer.confirm_password) {
        axios
            .patch(
                baseUrl + "customers/" + cookies.id + "/",
                customer,
                {
                  headers: {
                    Authorization: "Token " + cookies.csrftoken,
                  },
                }
            )
            .then((response) => {
              setCookie(null, "username", customer.username, {
                maxAge: 86400,
                path: "/",
              });
              setCookie(null, "email", customer.email, {
                maxAge: 86400,
                path: "/",
              });
              setCookie(null, "first_name", customer.first_name, {
                maxAge: 86400,
                path: "/",
              });
              setCookie(null, "last_name", customer.last_name, {
                maxAge: 86400,
                path: "/",
              });
              router.push("/");
            })
            .catch((error) => {
              console.log(error);
            });
      } else {
        alert("Les mots de passe ne correspondent pas");
      }
    } else {
      axios
          .patch(
              baseUrl + "customers/" + cookies.id + "/",
              customer,
              {
                headers: {
                  Authorization: "Token " + cookies.csrftoken,
                },
              }
          )
          .then((response) => {
            setCookie(null, "username", customer.username, {
              maxAge: 86400,
              path: "/",
            });
            setCookie(null, "email", customer.email, {
              maxAge: 86400,
              path: "/",
            });
            setCookie(null, "first_name", customer.first_name, {
              maxAge: 86400,
              path: "/",
            });
            setCookie(null, "last_name", customer.last_name, {
              maxAge: 86400,
              path: "/",
            });
            router.push("/");
          })
          .catch((error) => {
            console.log(error);
          });
    }
  };

  /**
   * @function submitEmp
   * @async
   * @description This function submits the updated information of the logged-in user if the user is an employee. It does so by making an HTTP PATCH request to the relevant endpoint. If the password is being updated, it ensures that the new password and the confirmation password match. In case of a successful response, it updates the relevant cookies and redirects the user to the home page. If the passwords do not match, it alerts the user.
   * @param {object} evt - The submit event from the form.
   * @memberof 'profil_utilisateur.js'
   * @returns {void}
   */
  const submitEmp = (evt) => {
    evt.preventDefault();

    if (customer.password !== "") {
      if (customer.password === customer.confirm_password) {
        axios
            .patch(
                baseUrl + "employees/" + cookies.id + "/",
                customer,
                {
                  headers: {
                    Authorization: "Token " + cookies.csrftoken,
                  },
                }
            )
            .then((response) => {
              setCookie(null, "username", customer.username, {
                maxAge: 86400,
                path: "/",
              });
              setCookie(null, "email", customer.email, {
                maxAge: 86400,
                path: "/",
              });
              setCookie(null, "first_name", customer.first_name, {
                maxAge: 86400,
                path: "/",
              });
              setCookie(null, "last_name", customer.last_name, {
                maxAge: 86400,
                path: "/",
              });
              router.push("/");
            })
            .catch((error) => {
              if (error.response.data.username == "custom user with this username already exists.") {
                alert("Ce nom d'utilisateur existe déjà");
              }
            });
      } else {
        alert("Les mots de passe ne correspondent pas");
      }
    } else {
      axios
          .patch(
              baseUrl + "employees/" + cookies.id + "/",
              customer,
              {
                headers: {
                  Authorization: "Token " + cookies.csrftoken,
                },
              }
          )
          .then((response) => {
            setCookie(null, "username", customer.username, {
              maxAge: 86400,
              path: "/",
            });
            setCookie(null, "email", customer.email, {
              maxAge: 86400,
              path: "/",
            });
            setCookie(null, "first_name", customer.first_name, {
              maxAge: 86400,
              path: "/",
            });
            setCookie(null, "last_name", customer.last_name, {
              maxAge: 86400,
              path: "/",
            });
            router.push("/");
          })
          .catch((error) => {
            if (error.response.data.username) {
              alert("Ce nom d'utilisateur existe déjà");
            }
          });
    }
  };

  /**
   * @function handleSubmit
   * @async
   * @description This function submits the updated user information by calling either submitCusto or submitEmp depending on the role of the user.
   * @param {object} evt - The submit event from the form.
   * @memberof 'profil_utilisateur.js'
   * @returns {void}
   */
  const handleSubmit = (evt) => {
    if (cookies.role === "customer") {
      submitCusto(evt);
    } else if (cookies.role === "employee" || cookies.role === "admin") {
      submitEmp(evt);
    }
  };

  /**
   * @function handleDelete
   * @description This function handles the deletion of the user account. It first asks for confirmation from the user. If confirmed, it makes an HTTP DELETE request to the relevant endpoint based on the user's role. After the deletion is successful, it clears all the related cookies and redirects the user to the home page with a success message.
   * @param {object} evt - The click event from the delete account button.
   * @memberof 'profil_utilisateur.js'
   * @returns {void}
   */
  const handleDelete = (evt) => {
    evt.preventDefault();
    let response;
    response = axios
        .delete(baseUrl + "customers/" + cookies.id + "/", {
          headers: {
            Authorization: "Token " + cookies.csrftoken,
          },
        })
        .then((response) => {
          Cookies.remove("id");
          Cookies.remove("csrftoken");
          Cookies.remove("email");
          Cookies.remove("username");
          Cookies.remove("last_name");
          Cookies.remove("first_name");
          Cookies.remove("role");
          router.push("/");
          alert("Votre compte a bien été supprimé");

          setTimeout(() => {
            window.location.reload();
          }, 500);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
      <>
        <Header />
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} transparent>
          <Modal.Header closeButton>
            <Modal.Title>SUPPRESSION DE COMPTE</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Voulez-vous vraiment supprimer votre compte ?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
        <main>
          <div
              className="container d-flex justify-content-center"
              style={{ marginTop: "5%" }}
          >
            <div className="card mb-3" style={{ width: "800px" }}>
              <div className="row g-0">
                <div
                    className="col-md-5 col-lg-4 col-xl-3"
                    style={{ backgroundColor: "#232627" }}
                >
                  <div className="card-body">
                    <h2
                        className="card-title"
                        style={{ color: "white", textAlign: "center" }}
                    >
                      Profil
                    </h2>
                  </div>
                </div>
                <div className="col-md-7 col-lg-8 col-xl-9 d-flex align-items-center">
                  <div
                      style={{ margin: "15px", width: "100%" }}
                  >
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label" id="username">
                        Nom d'utilisateur :
                      </label>
                      <input
                          type="text"
                          className="form-control"
                          data-id="username"
                          value={customer.username}
                          onChange={handleChange}
                          required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email :
                      </label>
                      <input
                          type="email"
                          data-id="email"
                          className="form-control"
                          id="email"
                          value={customer.email}
                          onChange={handleChange}
                          required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Prénom :
                      </label>
                      <input
                          type="text"
                          data-id="first_name"
                          className="form-control"
                          id="name"
                          value={customer.first_name}
                          onChange={handleChange}
                          required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="prenom" className="form-label">
                        Nom :
                      </label>
                      <input
                          type="text"
                          data-id="last_name"
                          className="form-control"
                          id="prenom"
                          value={customer.last_name}
                          onChange={handleChange}
                          required
                      />
                    </div>
                    {role === "customer" && (
                        <div className="mb-3">
                          <label htmlFor="tel_number" className="form-label">
                            Numéro de téléphone :
                          </label>
                          <input
                              type="text"
                              data-id="tel_number"
                              className="form-control"
                              id="tel_number"
                              value={customer.tel_number}
                              onChange={handleChange}
                              required
                          />
                        </div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="pass" className="form-label">
                        Nouveau mot de passe :
                      </label>
                      <input
                          type="password"
                          className="form-control"
                          data-id="password"
                          value={customer.password}
                          onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPas" className="form-label">
                        Confirmer le nouveau mot de passe :
                      </label>
                      <input
                          type="password"
                          className="form-control"
                          id="confirmPas"
                          data-id="confirm_password"
                          value={customer.confirm_password}
                          onChange={handleChange}
                      />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        style={{ backgroundColor: "#232627", border: 0 }}
                    >
                      Modifier
                    </button>{" "}

                    <br />
                    <br />
                    {role === "customer" && (
                        <button
                            className="btn btn-primary"
                            onClick={handleShow}
                            style={{ backgroundColor: "#DC3545", border: "none" }}
                        >
                          Supprimer mon compte
                        </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
  );
}
