import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import axios from 'axios';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';
import Head from "next/head";

/**
 * @namespace 'inscription.js'
 * @description This component provides the functionality to create and manage the registration form.
 * @returns {JSX.Element} A React functional component rendering the registration form.
 */
export default function Inscription() {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  /**
   * @constant router
   * @memberof 'inscription.js'
   * @see {@link 'header.js'.router}
   */
  const router = useRouter();

  /**
   * @constant phoneError
   * @memberof 'inscription.js'
   * @description This state variable stores the phone number error.
   * @default {phoneError: ""}
   * @see {@link 'connexion.js'.passwordError}
   * @returns {string} The phone number error.
   */
  const [phoneError, setPhoneError] = useState("");

  /**
   * @constant showPassword
   * @memberof 'inscription.js'
   * @description This state variable stores the password visibility.
   * @default {showPassword: false}
   * @see {@link 'connexion.js'.showPassword}
   * @returns {boolean} The password visibility.
   */
  const [passwordError, setPasswordError] = useState("");

  /**
   * @constant customers
   * @memberof 'inscription.js'
   * @description This state variable stores the customer's data.
   * @property {string} first_name The customer's first name.
   * @property {string} last_name The customer's last name.
   * @property {string} username The customer's username.
   * @property {string} email The customer's email address.
   * @property {string} tel_number The customer's phone number.
   * @property {string} password The customer's password.
   * @default {first_name: "", last_name: "", username: "", email: "", tel_number: "", password: ""}
   */
  const [customers, setCustomers] = useState([
    {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      tel_number: "",
      password: ""
    }
  ]);

  /**
   * @constant confirmPassword
   * @memberof 'inscription.js'
   * @description This state variable stores the customer's password confirmation.
   * @property {string} confirmPassword The customer's password confirmation.
   * @default {confirmPassword: ""}
   */
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * @memberof 'inscription.js'
   * @const handleChange
   * @description This function handles the change of the input fields.
   * @param {Event} evt The event triggered by the input field.
   * @returns {void} Nothing.
   * @see {@link 'connexion.js'.handleChange}
    */
  const handleChange = (evt) => {
    let value = evt.target.value;

    // Supprimer les espaces s'il s'agit du numéro de téléphone
    if (evt.target.dataset.id === "tel_number") {
      value = value.replace(/\s/g, '');

      // Vérifie que le numéro de téléphone contient uniquement des chiffres
      if (!/^\d+$/.test(value)) {
        setPhoneError("Veuillez entrer uniquement des chiffres pour le numéro de téléphone.");
        return;
      }
    }

    setCustomers({ ...customers, [evt.target.dataset.id]: value });

    if (evt.target.dataset.id === "tel_number" && value.length !== 10) {
      setPhoneError("Veuillez entrer exactement 10 chiffres pour le numéro de téléphone.");
    } else {
      setPhoneError("");
    }

    if (evt.target.dataset.id === "password" && evt.target.value.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
    } else {
      setPasswordError("");
    }
  };




  /**
   * @function handleConfirmPasswordChange
   * @memberof 'inscription.js'
   * @description This function handles the password confirmation.
   * @param {object} evt The event object.
   * @returns {void}
   */
  const handleConfirmPasswordChange = (evt) => {
    setConfirmPassword(evt.target.value);
  };

  /**
   * @function handleSubmit
   * @memberof 'inscription.js'
   * @description This function handles the registration form submission.
   * @param {object} evt The event object.
   * @returns {void}
   * @async
   */
  const handleSubmit =  (evt) => {
    evt.preventDefault();

    if (customers.password !== confirmPassword) {
      alert("Les deux mots de passe ne sont pas identiques !");
      return;
    }

    axios.post(baseUrl + 'customers/create', customers)
        .then((response) => {
          console.log(response.data);
          setCookie(null, "id", response.data.id, { maxAge: 86400, path: "/" });
          setCookie(null, 'csrftoken', response.data.token, { maxAge: 86400, path: '/' });
          setCookie(null, 'email', response.data.email, { maxAge: 86400, path: '/' });
          setCookie(null, 'username', response.data.username, { maxAge: 86400, path: '/' });
          setCookie(null, 'last_name', response.data.last_name, { maxAge: 86400, path: '/' });
          setCookie(null, 'first_name', response.data.first_name, { maxAge: 86400, path: '/' });
          setCookie(null, 'role', response.data.role, { maxAge: 86400, path: '/' });
          router.push('/').then(r => r);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Tina Coiffure | Inscription</title>
        </Head>
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                <Card className="border-0 shadow-lg mb-3 d-flex flex-column rounded p-3 bg-light shadow-sm">
                  <Card.Body className="p-4">
                    <Card.Title className="text-center mb-4">
                      <Link href="/" className="text-decoration-none text-dark">
                        <div className="d-flex justify-content-center align-items-center gap-3">
                          <img src="/images/tina_logo.png" alt="logo" className="img-fluid" width="60" />
                          <h2 className="font-weight-bold" style={{ fontFamily: "Abhaya Libre", fontSize: "38px" }}>Tina Coiffure</h2>
                        </div>
                      </Link>
                    </Card.Title>
                    <Card.Subtitle className="mb-4">
                      <h4 className="text-center font-weight-bold">Inscription</h4>
                    </Card.Subtitle>
                    <Form onSubmit={handleSubmit} className="pt-3">
                      <Form.Group className="mb-3">
                        <Form.Control required data-id="last_name" className="shadow-sm" type="text" placeholder="Nom" value={customers.last_name} onChange={handleChange}/>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control required data-id="first_name" className="shadow-sm" type="text" placeholder="Prénom" value={customers.first_name} onChange={handleChange}/>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control required data-id="username" className="shadow-sm" type="text" placeholder="Pseudo" value={customers.username} onChange={handleChange}/>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control required data-id="email" className="shadow-sm" type="email" placeholder="Email" value={customers.email} onChange={handleChange}/>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control required data-id="tel_number" className="shadow-sm" type="text" placeholder="076 000 00 00" value={customers.phone} onChange={handleChange}/>
                        {phoneError && <Form.Text className="text-danger">{phoneError}</Form.Text>}
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control required data-id="password" className="shadow-sm" type="password" placeholder="Mot de passe (8 caractères minimum)" minLength="8" value={customers.password} onChange={handleChange}/>
                        {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control required data-id="confirmPassword" className="shadow-sm" type="password" placeholder="Confirmer mot de passe" minLength="8" onChange={handleConfirmPasswordChange}/>
                      </Form.Group>
                      <Button variant="primary" type="submit" className='w-100 border-0 shadow-sm' style={{ backgroundColor: "#232627", marginBottom: "10px" }}>
                        S'inscrire
                      </Button>
                      <Form.Group className="mt-3 mb-1 text-center">
                        <Form.Text className="text-muted">
                          En vous inscrivant, vous acceptez les
                          <Link href="#" className="text-decoration-none"> Conditions d'utilisation </Link>
                          et la
                          <Link href="#"  className="text-decoration-none"> Politique de confidentialité </Link>,
                          notamment l'Utilisation des
                          <Link href="#"  className="text-decoration-none"> cookies</Link>.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-0 text-center">
                        <Link className="nav-link p-0" href="/components/identification/connexion">Vous avez déjà un compte ?</Link>
                      </Form.Group>
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
