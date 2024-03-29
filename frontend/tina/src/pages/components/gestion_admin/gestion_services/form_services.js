import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { useRef } from 'react';
import Header from '../../header';
import Footer from '../../footer';
import Head from "next/head";

/**
 * @namespace 'form_services.js'
 * @description page that regroup all the services components to create a new service
 * @returns {JSX.Element}
 */
export default function Formulaire_services() {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


    // Constantes pour les URL de l'API
    /**
     * @memberof 'form_services.js'
     * @constant {String}urlServices - url to get the services
    */
    /**
    * @memberof 'form_services.js'
    * @constant {String}urlTypesOfService - url to get the types of services
    */
    /** 
    * @memberof 'form_services.js'
    * @constant {String}pathnameModal - pathname to redirect to the services page
    */
    /** 
    * @memberof 'form_services.js'
    * @constant {baseUrl} baseUrl The base URL of the API
    */
    const urlServices = baseUrl + 'services/';
    const urlTypesOfService = baseUrl + 'typesofservice/';
    // Pathname pour la redirection de page
    const pathnameModal = "./menu_services";


    /**
     * @memberof 'form_services.js'
     * @constant {Interger} typeOfService - id of the type of service selected
     * @default 0
     */
    const [typeOfService, setTypeOfService] = useState(0);

    /**
     * @memberof 'form_services.js'
     * @constant {Array} service - array of the services
     * @default [{name: '', price: 0, price_student: 0, duration: 0}]
     * @constant {String} name - name of the service
     * @constant {Interger} price - price of the service
     * @constant {Interger} price_student - price of the service for students
     * @constant {Interger} duration - duration of the service
     * @description array of the services
     */
    const [service, setService] = useState([
        {
            name: '',
            price: 0,
            price_student: 0,
            duration: 0,
        }
    ]);

    /**
     * @memberof 'form_services.js'
     * @function handleChange 
     * @description function to change the value of the service. function to change the value of the service, but also to format the duration
     * @param {object} evt - event
     */

    const handleChange = (evt) => {
        console.log("handleChange");
        const index = evt.target.closest('form').dataset.index;
        console.log('index', parseInt(index));
        let val = evt.target.value;
        if (evt.target.dataset.id === 'duration') {
            val = formatTime(val);
        }
        setService((prevService) =>
            prevService.map((item, i) =>
                i === parseInt(index)
                    ? { ...item, [evt.target.dataset.id]: val }
                    : item
            )
        );
        if (val !== '' || val !== 0) {
            evt.target.classList.replace('is-invalid', 'is-valid');
        }

    };

    /**
     * @memberof 'form_services.js'
     * @function handleSelect 
     * @description function to change the value of the type of service
     * @param {object} evt - event
     */
    const handleSelect = (evt) => {
        setTypeOfService(evt.target.value);
        if (evt.target.value !== 0) {
            document.getElementById('select_type_of_service').classList.replace('is-invalid', 'is-valid');
        }
    };

    /**
     * @memberof 'form_services.js'
     * @constant {Interger} compteur - counter of the number of services added
     * @default 0
     */
    const [compteur, setCompteur] = useState(0);


    /**
     * @memberof 'form_services.js'
     * @constant {Array} lstServices Array that contains all the services
     * @see {@link 'services.js'.lstServices}
     * @default {Array} lstServices []
     * 
     */
    /**
     * @memberof 'form_services.js'
     * @constant {Array} lstTypesOfService Array that contains all the types of service
     * @see {@link 'services.js'.lstTypesOfService}
     * @default {Array} lstTypesOfService []
    */
    /**
     * @memberof 'form_services.js'
      * @constant {Array} lstNameServices Array that contains all the names of the services
      * @default {Array} lstNameServices []
     */

    const [lstNameServices, setLstNameServices] = useState([]);
    const [lstServices, setLstServices] = useState([]);
    const [listTypeOfService, setListTypeOfService] = useState([]);

    /**
     * @memberof 'form_services.js'
     * @constant {boolean} dataFetchedRef
     * @default false
     * @description boolean to know if the data is fetched, it prevents the useEffect to be called twice
     */
    const dataFetchedRef = useRef(false);

    /**
     * @memberof 'form_services.js'
     * @function addService
     * @description function to add a service by adding a new object JSON in the array service and incrementing the counter
     * @param {object} evt - event
     */
    const addService = (evt) => {
        evt.preventDefault();
        document.getElementById('btn_save_serv').classList.replace('disabled', 'enabled');
        setCompteur(compteur + 1);

        //Quand un service est ajouté, on ajoute un nouvel objet JSON dans le tableau service
        setService(prevService => [
            ...prevService, // On copie tous les éléments de prevService
            {             // Et on ajoute un nouvel objet JSON
                name: "",
                price: 0,
                price_student: 0,
                duration: 0,
            }
        ]);
    };


    //Formattage des minutes pour le submit
    /**
     * @memberof 'form_services.js'
     * @param {Integer} minutes minutes to format
     * @function formatTime
     * @description function to format the minutes to hours and minutes
     * @see {@link 'form_services_modify.js'.formatTime}
     * @returns {String} hours and minutes formatted
     */
    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    /**
     * @function handleSubmit
     * @description go through the array of services and call the postService function for each service if the fields are not empty and if the type of service is selected. then if there is no error, call the successMessage function
     * @see {@link 'form_services_modify.js'.postService}
     * @see {@link 'form_services_modify.js'.successMessage}
     */
    const handleSubmit = () => {
        console.log("handleSubmit");
        console.log("typeOfService ", typeOfService);
        console.log("compteur ", compteur)

        for (let i = 0; i < compteur; ++i) {
            console.log("start for");

            let statusOK = true;
            // boucle for pour envoyer les services
            if (typeOfService === 0) {
                console.log("typeOfService === 0");
                document.getElementById('select_type_of_service').setAttribute('class', 'form-select is-invalid');
                statusOK = false;
            } else {
                document.getElementById('select_type_of_service').setAttribute('class', 'form-control is-valid')
            }

            const s = service[i + 1];
            if (lstNameServices.includes(s.name.toLowerCase())) {
                console.log("lstNameServices.includes(s.name.toLowerCase())");
                document.getElementById('service_titre' + (i + 1)).setAttribute('class', 'form-control is-invalid');
                document.getElementById('service_titre_error' + (i + 1)).innerHTML = "Ce service existe déjà";
                statusOK = false;
            } else if (s.name === "") {
                console.log("s.name === ''");
                document.getElementById('service_titre' + (i + 1)).setAttribute('class', 'form-control is-invalid');
                document.getElementById('service_titre_error' + (i + 1)).innerHTML = 'Le titre ne peut pas être vide.';
                statusOK = false;
            }
            else {
                document.getElementById('service_titre' + (i + 1)).setAttribute('class', 'form-control is-valid');
            }
            if (s.price === 0) {
                console.log("s.price === 0");
                document.getElementById('service_prix' + (i + 1)).setAttribute('class', 'form-control is-invalid');
                statusOK = false;
            } else {
                document.getElementById('service_prix' + (i + 1)).setAttribute('class', 'form-control is-valid');
            }
            if (s.price_student === 0) {
                console.log("s.price_student === 0");
                document.getElementById('service_studentprice' + (i + 1)).setAttribute('class', 'form-control is-invalid');
                statusOK = false;
            }
            else {
                document.getElementById('service_studentprice' + (i + 1)).setAttribute('class', 'form-control is-valid');
            }
            if (s.duration === 0) {
                console.log("s.duration === 0");
                document.getElementById('service_temps' + (i + 1)).setAttribute('class', 'form-control is-invalid');
                statusOK = false;
            }
            else {
                document.getElementById('service_temps' + (i + 1)).setAttribute('class', 'form-control is-valid');
            }
            if (statusOK) {
                s.type_of_service = typeOfService;
                postService(s);
            }
        }


    };

    /**
     * @memberof 'form_services.js'
     * @function successMessage
     * @description the function to show the success message then hide it after 5 seconds and refresh the page
     * @see {@link 'encaissement.js'.successMessage}
     */

    const successMessage = () => {
        document.getElementById("notification_success").removeAttribute("hidden");
        //après 3 secondes, on cache la notification
        setTimeout(function () {
            if (document.getElementById("notification_success") != null) {
                document.getElementById("notification_success").setAttribute("hidden", "hidden");
            }
        }, 10000);
    };

    /**
     * @memberof 'form_services.js'
     * @function errorMessage
     * @description the function to show the error message then hide it after 3 seconds and refresh the page
     * @see {@link 'encaissement.js'.errorMessage}
     */
    const errorMessage = () => {
        document.getElementById("notification_error").removeAttribute("hidden");
        //après 3 secondes, on cache la notification
        setTimeout(function () {
            if (document.getElementById("notification_error") != null) {
                document.getElementById("notification_error").setAttribute("hidden", "hidden");
            }
        }, 10000);
    };

    /**
     * @memberof 'form_services.js'
     * @function postService  
     * @description post a service and set the success state to true if there is no error, else set the success state to false and call the errorMessage function
     * @param {object} s - service to post
     */
    const postService = (s) => {
        console.log("postService");
        const cookies = parseCookies();

        axios.post(urlServices, s, {
            headers: {
                Authorization: 'Token ' + cookies.csrftoken,
            },
        })
            .then((response) => {
                console.log("response ", response.status);
                if (response.status === 201) {
                    successMessage();
                } else {
                    errorMessage();
                }
            })
            .catch((error) => {
                errorMessage();
                console.log(error);
            });

    };

    /**
     * @memberof 'form_services.js'
     * @function fetchServices
     * @description Function to fetch the services from the API
     * @see {@link 'header.js'.cookies}
     * @see {@link 'gestion_encaissement.js'.fetchServices}
     */
    const fetchServices = () => {
        const cookies = parseCookies();
        axios.get(urlServices, {
            headers: {
                Authorization: 'Token ' + cookies.csrftoken,
            },
        })
            .then((response) => {
                setLstServices(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    /**
     * @memberof 'form_services.js'
     * @function loadNameServices
     * @description loads the names of the service in an array
     */
    const loadNameServices = () => {
        let lstServ = [];
        lstServices.map((s) => {
            lstServ.push(s.name.toLowerCase());
        });
        setLstNameServices(lstServ);
    };

    /**
     * @memberof 'form_services.js'
     * @function fetchTypeOfService
     * @description fetch the types of services and set the listTypeOfService state to the response data
     * @see {@link 'form_services_modify.js'.fetchTypeOfService}
     */
    const fetchTypeOfService = () => {
        const cookies = parseCookies();
        axios.get(urlTypesOfService, {
            headers: {
                Authorization: 'Token ' + cookies.csrftoken,
            },
        })
            .then((response) => {
                setListTypeOfService(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //Partie servant à charger les formulaires des services
    //On crée un tableau de composants qui contiendra les formulaires des services
    /**
     * @memberof 'form_services.js'
     * @constant {Array} lstNvServices - array of components to contain the forms of the services
     * @default []
     */
    let lstNvServices = [];

    //On crée une fonction qui va charger les formulaires des services selon le compteur
    /**
     * @memberof 'form_services.js'
     * @function loadServices - function to load the forms of the services
     * @description create a component for each service and add it to the lstNvServices array
     * @returns {Array} array of components to contain the forms of the services
     */
    const loadServices = () => {
        for (let n = 0; n < compteur; n++) {
            let i = n + 1;
            lstNvServices.push(
                <div
                    className="mb-3 d-flex flex-column rounded p-3 bg-light shadow-sm position-relative"
                    id='form'
                >
                    <label className="fs-5">Service {i}</label>
                    <ul></ul>
                    <div className="input-group mb-3">
                        <form className="form-floating" data-index={i}>
                            <input type="text" class={"form-control "} id={"service_titre" + i} data-id={"name"} placeholder={'Le titre du service ' + i} onChange={handleChange}></input>
                            <label htmlFor={"service_titre" + i}>Titre</label>
                            <div class="invalid-feedback" id={'service_titre_error' + i}>
                            </div>
                        </form>
                    </div>

                    <div className="input-group mb-3">
                        <form className="form-floating" data-index={i}>
                            <input type="number" class={"form-control "} id={"service_prix" + i} data-id={"price"} placeholder="0" onChange={handleChange}></input>
                            <label htmlFor={"service_prix" + i}>Prix normal</label>
                            <div class="invalid-feedback">
                                Le prix ne peut pas être vide.
                            </div>
                        </form>
                        <span class="input-group-text">CHF</span>
                    </div>


                    <div className="input-group mb-3">
                        <form className="form-floating" data-index={i}>
                            <input type="number" class={"form-control "} id={"service_studentprice" + i} data-id={"price_student"} placeholder="0" onChange={handleChange}></input>
                            <label htmlFor={"service_studentprice" + i}>Prix etudiant</label>
                            <div class="invalid-feedback">
                                Le prix ne peut pas être vide.
                            </div>
                        </form>
                        <span class="input-group-text">CHF</span>
                    </div>

                    <div className="input-group mb-3">
                        <form className="form-floating" data-index={i}>
                            <select class={"form-select "} aria-label="Temps de service" id={"service_temps" + i} data-id={"duration"} onChange={handleChange}>
                                <option value="0">0</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="45">45</option>
                                <option value="60">60</option>
                                <option value="75">75</option>
                                <option value="90">90</option>
                                <option value="105">105</option>
                                <option value="120">120</option>
                            </select>
                            <label htmlFor={"service_temps" + i}>Duree</label>
                            <div class="invalid-feedback">
                                La durée doit être supérieure à 0.
                            </div>
                        </form>
                        <span class="input-group-text">MIN</span>
                    </div>
                </div >
            );
        }
        return lstNvServices;
    };

    /**
     * @memberof 'form_services.js'
     * @function useEffect
     * @description when the component is mounted, fetch the types of services and the services
     * @see {@link 'form_services.js'.fetchTypeOfService}
     * @see {@link 'form_services.js'.fetchServices}
     */
    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        fetchTypeOfService();
        fetchServices();
    }, []);

    /**
     * @memberof 'form_services.js'
     * @function useEffect
     * @description when services are fetched, load the names of the services
     * @see {@link 'form_services.js'.loadServices}
     */
    useEffect(() => {
        loadNameServices();
    }, [lstServices]);

    return (
        <>
            <Head>
                <title>Tina - Création de service</title>
                <meta name="description" content="Page pour la création de service de l'application Tina" />
            </Head>
            <Header />

            <main>
                <div className="container pt-5">
                    <div className="container py-5">
                        <div className="row justify-content-center text-center align-items-center">
                            <div className="col-lg-15"> {/* Remplacez ceci par la taille de colonne que vous préférez */}
                                <div className="card border-0 shadow-lg mb-3 d-flex flex-column rounded p-3 bg-light shadow-sm">
                                    <div className="card-body text-center align-items-center">
                                        <h1 className="card-title text-center">Création de services</h1>

                                        <div id={"notification_success"} className="alert alert-success" role="alert" hidden>
                                            <h4 className="alert-heading">Création réussie</h4>
                                            <hr></hr>
                                            <p className="mb-0">Vous pouvez consulter tous les services en cliquant : <Link href={pathnameModal} className="alert-link">ICI</Link>
                                            </p>
                                        </div>
                                        <div id={"notification_error"} className="alert alert-danger" role="alert" hidden>
                                            <h4 className="alert-heading">Création Echouée</h4>
                                            <p>Veuillez vérifier que le service n'existe pas déjà. Vous pouvez consulter tous les services :  <Link href={pathnameModal} className="alert-link">ICI</Link></p>
                                        </div>


                                        <div className="text-center">
                                            <div className="d-flex justify-content-center">
                                                <div className="input-group mb-3 w-50">
                                                    <form className="form-floating">
                                                        <select className="form-select" aria-label="select_type_of_service" id='select_type_of_service' data-id="type_of_service" onChange={handleSelect}>
                                                            <option key='0' value='0'>Sélectionnez un type de service...</option>
                                                            {listTypeOfService.map(item => {
                                                                return (<option key={item.id} value={item.id}>{item.name}</option>);
                                                            })}
                                                        </select>
                                                        <label htmlFor="select_type_of_service">Type de service</label>
                                                        <div className="invalid-feedback">
                                                            Le type de service ne peut pas être vide.
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>

                                            <div>
                                                {loadServices()}
                                            </div>

                                            <div className="d-flex justify-content-center mb-3">
                                                <button type="button" className="btn btn-dark" onClick={addService}>Ajouter un service</button>
                                            </div>

                                            <div className="d-flex justify-content-center mb-3">
                                                <Link href={pathnameModal} className="btn btn-secondary me-2">Annuler</Link>
                                                <button type="button" className="btn btn-primary disabled" id="btn_save_serv" onClick={handleSubmit}>Enregistrer</button>
                                            </div>
                                        </div>
                                    </div>
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