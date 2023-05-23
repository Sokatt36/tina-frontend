import { useEffect, useState } from "react";
import Header from "../header";
import { useRouter, Router } from "next/router";
import axios from "axios";
import { parseCookies } from "nookies";

/**
 * @namespace 'recap_rdv.js'
 * @description This component provides the functionality to display the appointment's recap. This component sends the appointment's data to the database.
 * @returns {JSX.Element} A React functional component rendering the appointment's recap.
 */
export default function RecapRdv() {

  /**
   * @constant services
   * @memberof 'recap_rdv.js'
   * @description An object of services.
   * @default {}
   */ 
  const [services, setServices] = useState({});

  /**
   * @constant coiffeurs
   * @memberof 'recap_rdv.js'
   * @description An object of employees.
   * @default {}
   */ 
  const [coiffeurs, setCoiffeurs] = useState({});

  /**
   * @constant heureDepart
   * @memberof 'recap_rdv.js'
   * @description The appointment's start time.
   * @default ''
   */ 
  const [heureDepart, setHeureDepart] = useState();

  /**
   * @constant heureFin
   * @memberof 'recap_rdv.js'
   * @description The appointment's end time.
   * @default ''
   */ 
  const [heureFin, setHeureFin] = useState();

  /**
   * @constant clients
   * @memberof 'recap_rdv.js'
   * @description A list of clients.
   * @default []
   */ 
  const [clients, setClients] = useState([]);

  /**
   * @constant description
   * @memberof 'recap_rdv.js'
   * @description The appointment's description.
   * @default ''
   */ 
  const [description, setDescription] = useState("");

  /**
   * @constant appointment
   * @memberof 'recap_rdv.js'
   * @description An object of appointment's data.
   * @ property {string} date - The appointment's date.
   * @ property {string} time - The appointment's time.
   * @ property {string} employee - The appointment's employee.
   * @ property {string} service - The appointment's service.
   * @ property {string} customer - The appointment's customer.
   * @ property {string} informations - The appointment's informations.
   * @default {date: null, time: null, employee: null, service: null, customer: null, informations: null}
   */ 
  const [appointment, setAppointment] = useState({
    date: null,
    time: null,
    employee: null,
    service: null,
    customer: null,
    informations: null,
  });

  /**
   * @constant myDate
   * @memberof 'recap_rdv.js'
   * @description Date object.
   * @default ''
   */
  const [myDate, setMyDate] = useState();

  /**
   * @constant router
   * @memberof 'recap_rdv.js'
   * @see {@link 'header.js'.router}
   */
  const router = useRouter();

  /**
   * @constant param
   * @memberof 'recap_rdv.js'
   * @see {@link 'calendrier_utilisateur.js'.param}
   */ 
  const param = router.query;

  /**
   * @constant cookies
   * @memberof 'recap_rdv.js'
   * @see {@link 'header.js'.cookies}
   */ 
  const cookies = parseCookies();

  /**
   * @function useEffect1
   * @memberof 'recap_rdv.js'
   * @description React hook that triggers the side effect function when the component is mounted.
   */
  useEffect(() => {
    setServices(JSON.parse(param.service));
    setCoiffeurs(JSON.parse(param.employee));
    setMyDate(param.date);
    if (cookies.role === "employee" || cookies.role === "admin") {
      console.log(param.client);
      if (param.client != "") {
        setClients(JSON.parse(param.client));
      }
      else {
        setDescription(param.description);
      }
    }
  }, []);


  useEffect(() => {
    const date = new Date();
    const splitTime = param.time.split(":");
    date.setHours(splitTime[0]);
    date.setMinutes(splitTime[1]);
    date.setSeconds(0);
    console.log(date);
    const formattedTime = date.toLocaleTimeString("fr-FR", { hour12: false });
    console.log(formattedTime);
    setHeureDepart(formattedTime);
    //const durationSplit = services.duration.toString().split(":");
    if (services.duration != null) {
      console.log(typeof services.duration);
      const duration = services.duration;
      const splitDuration = duration.split(":");
      console.log(splitDuration[1]);
      const minuteDuration = parseInt(splitDuration[1]);
      const endDate = new Date(date.getTime() + minuteDuration * 60000);
      const formattedEndTime = endDate.toLocaleTimeString("fr-FR", {
        hour12: false,
      });
      setHeureFin(formattedEndTime);
      console.log(formattedEndTime);
      // format date from dd/mm/yyyy to yyyy-mm-dd
      const splitDate = myDate.split("/");
      const formattedDate =
        splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        if (cookies.role === "customer") {

      setAppointment({
        ...appointment,
        date: formattedDate,
        time: heureDepart,
        employee: coiffeurs.id,
        service: services.id,
      });
    } else if (cookies.role === "employee" && param.client != "" || cookies.role === "admin" && param.client != "") {
      setAppointment({
        ...appointment,
        date: formattedDate,
        time: heureDepart,
        employee: coiffeurs.id,
        service: services.id,
        customer: clients.id,
      });
    }
    else if (cookies.role === "employee" && param.client == "" || cookies.role === "admin" && param.client == "") {
      console.log(description);
      setAppointment({
        ...appointment,
        date: formattedDate,
        time: heureDepart,
        employee: coiffeurs.id,
        service: services.id,
        informations: description,
      });
    }
    }
  }, [services]);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    console.log(appointment.date);
    console.log(appointment);
    axios
      .post("http://127.0.0.1:8000/api/appointments/create", appointment, {
        headers: {
          Authorization: `Token ` + cookies.csrftoken,
        },
      })
      .then((response) => {
        console.log(response.data);
        router.push("/components/prise_rendez_vous/confirmation_rdv");
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });
  };

  return (
    <>
      <Header />
      <div className="container " style={{ marginTop: "10%" }}>
        <h2>Récapitulatif du rendez-vous : </h2>
        <table class="table">
          <tbody>
            <tr>
              <td>Service </td>
              <td>{services.name}</td>
            </tr>
            <tr>
              <td>Coiffeur</td>
              <td>{coiffeurs.first_name + " " + coiffeurs.last_name}</td>
            </tr>
            {cookies.role === "employee" && clients != "" && (
              <tr>
                <td>Client</td>
                <td>{clients.first_name + " " + clients.last_name}</td>
              </tr>
            )}

            {cookies.role === "employee" && description != "" &&(
              <tr>
                <td>Description</td>
                <td>{description}</td>
              </tr>
            )
            }

            {cookies.role === "admin" && clients != "" && (
              <tr>
                <td>Client</td>
                <td>{clients.first_name + " " + clients.last_name}</td>
              </tr>
            )}

            {cookies.role === "admin" && description != "" &&(
              <tr>
                <td>Description</td>
                <td>{description}</td>
              </tr>
            )
            }
            <tr>
              <td>Date</td>
              <td>{myDate}</td>
            </tr>
            <tr>
              <td>Heure de départ</td>
              <td>{heureDepart}</td>
            </tr>
            <tr>
              <td>Heure de fin</td>
              <td>{heureFin}</td>
            </tr>
            <br />
            <button
              type="button"
              onClick={handleSubmit}
              class="btn btn-primary no-border"
              style={{ backgroundColor: "#232627" }}
            >
              Confirmer
            </button>
          </tbody>
        </table>
      </div>
    </>
  );
}
