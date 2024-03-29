import React, { useState, useEffect, useRef } from "react";
import Header from "@/pages/components/header";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { Card, Button } from "react-bootstrap";
import Footer from "@/pages/components/footer";
import Head from "next/head";
import { ProgressBar } from './ProgressBar';

/**
 * @namespace 'service_rdv.js'
 * @description This component provides the functionality to display the services and types of services.
 * @returns {JSX.Element}
 */
export default function ServiceRDV() {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  /**
   * @constant typesOfService
   * @memberof 'service_rdv.js'
   * @see {@link 'service_rdv.js'.typesOfService}
   * @description To store types of services
   * @default null
   */
  const [typesOfService, setTypesOfService] = useState(null);

  /**
   * @constant services
   * @memberof 'service_rdv.js'
   * @see {@link 'service_rdv.js'.services}
   * @description To store services
   * @summary This state variable is used to store the services fetched from the backend.
   * @default null
   */
  const [services, setServices] = useState(null);

  /**
   * @constant dataFetchedRef
   * @memberof 'service_rdv.js'
   * @see {@link 'service_rdv.js'.dataFetchedRef}
   * @description To check if data is already fetched or not
   * @summary The services are fetched only once when the component is mounted.
   * @summary The services are fetched only if they are not already fetched.
   * @summary This is done to avoid unnecessary API calls.
   * @type {React.MutableRefObject<boolean>}
   * @default false
   */
  const dataFetchedRef = useRef(false);

  /**
   * @constant cookies
   * @memberof 'service_rdv.js'
   * @see {@link 'header.js'.cookies}
   * @description To store cookies
   * @summary This state variable is used to store the cookies fetched from the browser.
   * @default null
   * @see {@link 'https://www.npmjs.com/package/nookies'.parseCookies}
   */
  const cookies = parseCookies();

  /**
   * @constant router
   * @memberof 'service_rdv.js'
   * @see {@link 'header.js'.router}
   * @description To store router
   * @summary This state variable is used to store the router object.
   * @summary The router object is used to redirect the user to the login page if the user is not logged in.
   * @summary The router object is used to redirect the user to the dashboard if the user is logged in.
   */
  const router = useRouter();

  /**
   * @constant fetchTypeOfService
   * @memberof 'service_rdv.js'
   * @description To fetch types of services
   * @summary This state variable is used to store the types of services fetched from the backend.
   * @returns {void}
   */
  const fetchTypeOfService = () => {
    axios
        .get(baseUrl + "typesofservice/", {
          headers: {
            Authorization: "Token " + cookies.csrftoken,
          },
        })
        .then((response) => {
          setTypesOfService(response.data); // Setting types of service in the state variable
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * @constant fetchServices
   * @memberof 'service_rdv.js'
   * @description To fetch services
   * @summary This state variable is used to store the services fetched from the backend.
   * @returns {void}
   */
  const fetchServices = () => {
    axios
        .get(baseUrl + "services/", {
          headers: {
            Authorization: "Token " + cookies.csrftoken,
          },
        })
        .then((response) => {
          setServices(response.data); // Setting services in the state variable
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * @constant formatDuration
   * @memberof 'service_rdv.js'
   * @description To format duration
   * @summary This function is used to format the duration of a service.
   * @summary The duration is in the format HH:MM.
   * @summary The duration is converted to minutes.
   * @summary The duration is returned in minutes.
   * @param duration
   * @return {number}
   */
  const formatDuration = (duration) => {
    const hours = duration.split(":")[0] * 60;
    const minutes = duration.split(":")[1];
    return parseInt(hours) + parseInt(minutes);
  };

  /**
   * @constant priceWithoutCent
   * @memberof 'service_rdv.js'
   * @description To get price without cent
   * @summary This function is used to get the price of a service without the cents.
   * @summary The price is in the format XX.XX.
   * @summary The price is converted to XX.
   * @summary The price is returned in XX.
   * @param price
   * @return {string}
   */
  const priceWithoutCent = (price) => {
    return price.split(".")[0];
  };

  /**
   * @constant minPriceForATypeOfService
   * @memberof 'service_rdv.js'
   * @description To get minimum price for a type of service
   * @summary This function is used to get the minimum price for a type of service.
   * @summary The minimum price is returned in XX.
   * @param typeOfService
   * @return {string}
   */
  const minPriceForATypeOfService = (typeOfService) => {
    if (services) {
      let filteredServices = services
          .filter((service) => service.type_of_service === typeOfService.id)
          .sort((a, b) => a.price - b.price);

      return filteredServices.length > 0
          ? priceWithoutCent(filteredServices[0].price)
          : 0; // or any other default value
    }
  };


  /**
   * @constant handleChooseService
   * @memberof 'service_rdv.js'
   * @description To handle choose service
   * @summary This function is used to redirect the user to the page where the user can choose the employee.
   * @summary The service is passed as a query parameter.
   * @summary The service is passed as a stringified JSON object because the service is an object.
   * @param service
   * @return {void}
   */
  const handleChooseService = (service) => {
    console.log(service);
    router.push({
      pathname: "/components/prise_rendez_vous/rdv_employee",
      query: { service: JSON.stringify(service) },
    });
  };

  /**
   * @constant useEffect
   * @memberof 'service_rdv.js'
   * @description To fetch data
   * @summary This function is used to fetch the types of service and services.
   * @summary The types of service and services are fetched only once.
   * @summary The types of service and services are fetched when the component is mounted.
   * @returns {void}
   */
  useEffect(() => {
    if (!cookies.csrftoken) {
      router.push("/components/identification/connexion");
    }
    if (dataFetchedRef.current) return; // Fetch data only once
    dataFetchedRef.current = true;

    Promise.all([fetchTypeOfService(), fetchServices()]).then(() => {
      // Fetching types of service and services
      console.log("Data fetched");
    });
  }, []);


  /**
   * @constant numCols
   * @memberof 'service_rdv.js'
   * @description To get number of columns
   * @summary This state variable is used to store the number of columns.
   * @summary The number of columns is calculated based on the number of types of service.
   * @summary The number of columns is calculated based on the number of types of service.
   * @returns {number}
   */
  const numCols = typesOfService && typesOfService.length <= 4 ? Math.floor(12 / typesOfService.length) : 3;

  return (
      <>
        <Head>
          <title>Tina - Prise de rendez-vous</title>
          <meta name="description" content="Page de prise de rendez-vous de l'application Tina"/>
        </Head>
        <Header /> {/* Render the Header component */}
        <main>
          <ProgressBar currentStep={1} />
          <div className="container">
            {/* Container for the services */}
            <div className="row">
              {typesOfService && // Check if types of service have been fetched before rendering the services
                  typesOfService.map((typeOfService) => (
                      <div className={`col-md-${numCols}`} key={typeOfService.id}>
                        {" "}
                        {/* Create a column for each service */}
                        <Card className="mb-4">
                          {" "}
                          {/* Create a card to display each type of service */}
                          <Card.Body>
                            <Card.Title
                                style={{
                                  color: "#232627",
                                  fontSize: "36px",
                                  marginBottom: "22px",
                                }}
                            >
                              {typeOfService.name}
                            </Card.Title>{" "}
                            {/* Display the name of the service type */}
                            <Card.Subtitle
                                className="mb-2"
                                style={{ color: "#F3B10E", fontSize: "28px" }}
                            >
                              À partir de CHF {minPriceForATypeOfService(typeOfService)}
                              .-
                            </Card.Subtitle>{" "}
                            {/* Display the minimum price for each type of service */}
                            <hr />
                            <div>
                              {services &&
                                  services
                                      .filter(
                                          (service) => service.type_of_service === typeOfService.id
                                      ) // Filter services based on their type
                                      .sort((a, b) => b.price - a.price) // Sort services by price in descending order
                                      .map((service) => (
                                          <div
                                              className="mb-3 d-flex flex-column"
                                              key={service.id}
                                              style={{
                                                background: "whiteSmoke",
                                                borderRadius: "6px",
                                                padding: "10px",
                                                boxShadow: "0 2px 4px rgba(0,0,0,.2)",
                                              }}
                                          >
                                            <div>
                                              <Card.Text className="mb-1">
                                                {service.name}
                                              </Card.Text>{" "}
                                              {/* Display the name of the service */}
                                              <Card.Text className="mb-2">
                                                {formatDuration(service.duration)} minutes,
                                                CHF {priceWithoutCent(service.price)}.-
                                              </Card.Text>{" "}
                                              {/* Display the duration and price of the service */}
                                            </div>
                                            <Button
                                                variant="primary"
                                                style={{
                                                  background: "#232627",
                                                  alignSelf: "flex-end",
                                                  borderColor: "#232627",
                                                  transition: "all 0.2s ease-in-out",
                                                }}
                                                onClick={() => handleChooseService(service)}
                                                onMouseOver={(e) =>
                                                    (e.target.style.background = "#383a3d")
                                                }
                                                onMouseOut={(e) =>
                                                    (e.target.style.background = "#232627")
                                                }
                                            >
                                              Choisir
                                            </Button>{" "}
                                            {/* Button to choose a service */}
                                          </div>
                                      ))}
                            </div>
                          </Card.Body>
                          <Card.Footer
                              className="text-muted"
                              style={{
                                background: "white",
                                alignSelf: "flex-end",
                                border: "none",
                              }}
                          >
                            Étudiant réduc 5.-
                          </Card.Footer>{" "}
                          {/* Footer displaying a discount for students */}
                        </Card>
                      </div>
                  ))}
            </div>
          </div>
        </main>
        <Footer /> {/* Render the Footer component */}
      </>
  );
}
