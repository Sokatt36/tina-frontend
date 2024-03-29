import { useState } from 'react';
import Header from '../../header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import Head from "next/head";
import Footer from "@/pages/components/footer";

/**
 * @namespace 'employe.js'
 * @description Page to add an employee
 * @returns {JSX.Element}
 */
export default function Employe() {

  /**
   * @memberof 'employe.js'
   * @constant baseUrl
   * @description URL of the API
   * @default NEXT_PUBLIC_BASE_URL
   * @type {string | string}
   * @see {@link 'header.js'.baseUrl}
   * @returns {string}
   */
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  /**
   * @memberof 'employe.js'
   * @constant employe
   * @description Employee to add
   * @default [{first_name: "", last_name: "", username: "", email: "", password: ""}]
   * @type {Array}
   * @returns {Array}
   */
  const [employe, setEmploye] = useState([
    {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: ""
    }
  ]);

  /**
   * @memberof 'employe.js'
   * @constant router
   * @description Router to redirect to another page
   * @see {@link 'header.js'.router}
   * @returns {NextRouter}
   * @type {NextRouter}
   */
  const router = useRouter();

  /**
   * @memberof 'employe.js'
   * @constant confirmPassword
   * @description Confirm password entered by the user
   * @default ""
   * @type {string}
   * @returns {string}
   */
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * @memberof 'employe.js'
   * @constant passwordError
   * @description Error message if the password is not valid
   * @default ""
   * @type {string}
   * @returns {string}
   */
  const [passwordError, setPasswordError] = useState("");

  /**
   * @memberof 'employe.js'
   * @function handleSubmit
   * @description Submit the form to add an employee
   * @see {@link 'employe.js'.setEmploye}
   * @param evt
   * @returns {void}
   */
  const handleSubmit =  (evt) => {
    const cookies = parseCookies();

    evt.preventDefault();

    if (employe.password !== confirmPassword) {
      alert("Les deux mots de passe ne sont pas identiques !");
      return;
    }

    axios.post(baseUrl + 'employees/', employe, {
      headers: {
        Authorization: `Token ` + cookies.csrftoken,
      },
    })
        .then((response) => {
          console.log(response.data);
          alert("L'employé a bien été ajouté !");
          router.push("../dash_admin");
        })
        .catch((error) => {
          console.log(error);
        });

  }

  /**
   * @memberof 'employe.js'
   * @function handleConfirmPassword
   * @description Set the confirm password entered by the user
   * @see {@link 'employe.js'.setConfirmPassword}
   * @param evt
   * @returns {void}
   */
  const handleConfirmPassword = (evt) => {
    setConfirmPassword(evt.target.value);
  };

  /**
   * @memberof 'employe.js'
   * @function handleChange
   * @description Set the employee entered by the user
   * @see {@link 'employe.js'.setEmploye}
   * @param evt
   * @returns {void}
   */
  const handleChange = (evt) => {
    setEmploye({ ...employe, [evt.target.dataset.id]: evt.target.value });

    if (evt.target.dataset.id === "password" && evt.target.value.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
    } else {
      setPasswordError("");
    }
  };

  return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Tina Coiffure | Création d'un employé</title>
        </Head>
        <Header />
        <main>
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                  <Card className="border-0 shadow-lg mb-3 d-flex flex-column rounded p-3 bg-light shadow-sm">
                    <Card.Body className="p-4">
                      <Card.Title className="text-center mb-4">
                        <div className="d-flex justify-content-center align-items-center gap-3">
                          <img src="/images/tina_logo.png" alt="logo" className="img-fluid" width="60" />
                          <h2 className="font-weight-bold" style={{ fontFamily: "Abhaya Libre", fontSize: "38px" }}>Tina Coiffure</h2>
                        </div>
                      </Card.Title>
                      <Card.Subtitle className="mb-4">
                        <h4 className="text-center font-weight-bold">Création d'un employé</h4>
                      </Card.Subtitle>
                      <Form onSubmit={handleSubmit} className="pt-3">
                        <Form.Group className="mb-3">
                          <Form.Control required data-id="last_name" className="shadow-sm" type="text" placeholder="Nom" value={employe.lastName} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Control required data-id="first_name" className="shadow-sm" type="text" placeholder="Prénom" value={employe.firstName} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Control required data-id="username" className="shadow-sm" type="text" placeholder="Pseudo" value={employe.username} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Control required data-id="email" className="shadow-sm" type="email" placeholder="Email" value={employe.email} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Control required data-id="password" className="shadow-sm" type="password" placeholder="Mot de passe (8 caractères minimum)" minLength="8" value={employe.password} onChange={handleChange}/>
                          {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Control required data-id="confirmPassword" className="shadow-sm" type="password" placeholder="Confirmer mot de passe" minLength="8" onChange={handleConfirmPassword}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" className='w-100 border-0 shadow-sm' style={{ backgroundColor: "#232627", marginBottom: "10px" }}>
                          Créer un compte employé
                        </Button>
                      </Form>

                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
  );
}