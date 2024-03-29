import { useState, useRef, useEffect } from "react";
import { Calendar } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import Header from "../header";
import axios from "axios";
import { addMinutes } from "date-fns";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import Footer from "../footer";

/**
 * @namespace 'calendrier_utilisateur.js'
 * @description This component provides the functionality to create and manage a user's calendar.
 * @returns {JSX.Element} A React functional component rendering the calendar interface.
 */

export default function CalendrierClient() {

  /**
   * @memberof 'calendrier_utilisateur.js'
   * @constant {String} baseUrl
   * @description variable to store the base of the url of the API
   * @default process.env.NEXT_PUBLIC_BASE_URL
   */ 
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  /**
   * @constant calendar
   * @memberof 'calendrier_utilisateur.js'
   * @description This stateful constant stores the calendar object.
   * @default null
   * @type {useState}
   */
  const [calendar, setCalendar] = useState(null);

  /**
   * @constant calendarEl
   * @memberof 'calendrier_utilisateur.js'
   * @description This constant contains a reference to the calendar HTML element.
   * @default null
   * @type {object}
   */
  const calendarEl = useRef(null);

  /**
   * @constant events
   * @memberof 'calendrier_utilisateur.js'
   * @description This stateful constant holds the array of events in the calendar.
   * @default []
   * @type {useState}
   */
  const [events, setEvents] = useState([]);

  /**
   * @constant event
   * @memberof 'calendrier_utilisateur.js'
   * @description This constant is an useRef used to determine we already passed in the useEffect.
   * @default false
   * @type {object}
   * @property {boolean} current - The current value of the ref.
   */
  const event = useRef(false);

  /**
   * @constant cookies
   * @memberof 'calendrier_utilisateur.js'
   * @see {@link 'header.js'.cookies}
   */
  const cookies = parseCookies();

  /**
   * @constant router
   * @memberof 'calendrier_utilisateur.js'
   * @see {@link 'header.js'.router}
   */
  const router = useRouter();

  /**
   * @var customer
   * @memberof 'calendrier_utilisateur.js'
   * @description This variable stores the customer's information.
   * @default null
   * @type {object}
   */
  let customer = null;

  /**
   * @var information
   * @memberof 'calendrier_utilisateur.js'
   * @description This variable stores the appointment's information.
   * @default null
   * @type {object}
   */
  let information = null;

   /**
   * @function handleClick
   * @memberof 'calendrier_utilisateur.js'
   * @description This function redirects the user to the appointment details page, passing the id of the appointment as a parameter.
   * @param {number} id - The ID of the appointment.
   * @returns {void}
   */
  const handleClick = (id) => {
    router.push({
      pathname: "/components/CRUD_utilisateur/CRUD_my_rdv/detail_rdv",
      query: { id: id },
    });
  };

  /**
   * @function useEffect1
   * @memberof 'calendrier_utilisateur.js'
   * @description This effect performs API calls to fetch user appointments and specific appointment data. It's run once when the component mounts.
   * @returns {void}
   * @async
   */
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          baseUrl + "my-appointments/",
          {
            headers: {
              Authorization: "Token " + cookies.csrftoken,
            },
          }
        );
        const appointments = response.data;
        console.log(appointments);

        if (appointments.length > 0) {
          const newEvents = await Promise.all(
            appointments
              .filter((a) => {
                return a.status === "pending" || a.status === "confirmed";
              })
              .map(async (appointment) => {
                // Fetch service info for each appointment
                let service
                if (appointment.service !== null) {
                  const response2 = await axios.get(
                    baseUrl + "services/" +
                      appointment.service +
                      "/",
                    {
                      headers: {
                        Authorization: "Token " + cookies.csrftoken,
                      },
                    }
                  );
                  service = response2.data;
                }
                let employee;
                if (appointment.employee !== null) {
                const response3 = await axios.get(
                  baseUrl + "employees/" +
                    appointment.employee +
                    "/",
                  {
                    headers: {
                      Authorization: "Token " + cookies.csrftoken,
                    },
                  }
                );
                  employee = response3.data;
                }

                console.log(appointment.customer);
                let response4 = null;
                if (appointment.customer != null) {
                  response4 = await axios.get(
                    baseUrl + "customers/" +
                      appointment.customer +
                      "/",
                    {
                      headers: {
                        Authorization: "Token " + cookies.csrftoken,
                      },
                    }
                  );
                  customer = response4.data;
                } else {
                  response4 = appointment.informations;
                  information = response4;
                }

                
                let myTitle = "";
                const start = new Date(
                  `${appointment.date}T${appointment.time}`
                );
                
                let end = addMinutes(start, appointment.duration.slice(3, 5));

                if (appointment.duration.slice(0, 2) !== "00") {
                  end = addMinutes(start, Number(appointment.duration.slice(0, 2)) * 60 + Number(appointment.duration.slice(3, 5)));
                }

                if (cookies.role === "customer") {
                  if (service !== undefined) {
                    if (employee !== undefined) {
                      myTitle = `Service : ${service.name} avec ${employee.first_name} ${employee.last_name} / (cliquez pour gérer le rendez-vous)`;
                    } else {
                      myTitle = `Service : ${service.name} avec un coiffeur à determiner / (cliquez pour gérer le rendez-vous)`;
                    }
                } else {
                  if (employee !== undefined) {
                    myTitle = `Service : Inconnu avec ${employee.first_name} ${employee.last_name} / (cliquez pour gérer le rendez-vous)`;
                  } else {
                    myTitle = `Service : Inconnu avec un coiffeur à determiner / (cliquez pour gérer le rendez-vous)`;
                  }
                }
                } else if (cookies.role === "employee" || cookies.role === "admin") {
                  if (appointment.customer != null) {
                    if (service !== undefined) {
                      myTitle = `Service : ${service.name} / avec le client ${customer.first_name} ${customer.last_name} (cliquez pour gérer le rendez-vous)`;
                    } else {
                      myTitle = `Service : Inconnu / avec le client ${customer.first_name} ${customer.last_name} (cliquez pour gérer le rendez-vous)`;
                    }
                  } else {
                    if (service !== undefined) {
                    myTitle = `Service : ${service.name} / informations : ${information} (cliquez pour gérer le rendez-vous)`;
                  } else {
                    myTitle = `Service : Inconnu / informations : ${information} (cliquez pour gérer le rendez-vous)`;
                  }
                  }
                }

                // Create event object with service info
                return {
                  id: appointment.id,
                  title: myTitle,
                  start: start.toISOString(),
                  end: end.toISOString(),
                  allDay: false,
                  service: service, // add service info to event object
                };
              })
          );
          setEvents(newEvents);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointments();
  }, []);

  /**
   * @function useEffect2
   * @memberof 'calendrier_utilisateur.js'
   * @description This effect is responsible for sending events to the calendar and calling the handleClick function. It runs when the events state changes.
   * @returns {void}
   * @async
   */

  useEffect(() => {
    if (calendar !== null && events.length > 0) {
      if (event.current) return;
      event.current = true;
      console.log(events);
      calendar.addEventSource(events);
      // Ajouter la classe 'event-passe' aux événements passés
      const maintenant = new Date();
      const eventsPasse = calendar
        .getEvents()
        .filter((event) => event.start < maintenant);
      eventsPasse.forEach((event) => {
        event.setProp("classNames", ["event-passe"]);
      });

      calendar.setOption("eventClick", (info) => {
        handleClick(info.event.id);
      });
    }
  }, [events]);

  /**
   * @function useEffect3
   * @memberof 'calendrier_utilisateur.js'
   * @description This effect sets up the calendar and displays the events. It's run once when the component mounts.
   * @returns {void}
   * @async
   */
  useEffect(() => {
    if (calendarEl.current !== null) {
      const newCalendar = new Calendar(calendarEl.current, {
        initialView: "listWeek",
        firstDay: 1,
        height: "auto",
        allDaySlot: false,
        slotDuration: "00:15:00",
        slotEventOverlap: false,
        slotMinTime: "09:00:00",
        slotMaxTime: "19:00:00",
        headerToolbar: {
          start: "prev,next today",
          center: "title",
          end: "listWeek",
        },
        views: {
          timeGridWeek: {
            type: "timeGrid",
            duration: { weeks: 1 },
            buttonText: "Semaine",
            contentHeight: 500,
            slotLabelFormat: {
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: false,
              meridiem: "narrow",
            },
          },
        },
        plugins: [listPlugin],
        locale: "fr", // définit la langue du calendrier en français
        buttonText: {
          today: "aujourd'hui",
        },
        eventContent: function (info) {
          const available = info.event.extendedProps.available;
          const backgroundColor = available ? "#587792" : "#587792"; // Détermine la couleur de fond en fonction de la disponibilité
          const title = info.event.title.split(" / ");
          const textColor = available ? "white" : "black"; // Détermine la couleur du texte en fonction de la disponibilité
          return {
            html: `<div style="text-align: center; background-color: ${backgroundColor}; cursor:pointer; color: white; font-size:12px;"><div >${title[0]}</div><div >${title[1]}</div></b></div>`,
          };
        },
      });

      setCalendar(newCalendar);
      newCalendar.render();

      return () => {
        newCalendar.destroy();
      };
    }
  }, [calendarEl]);

  return (
    <>
      <style>
        {`@media (max-width: 600px) {
        .fc-today-button {
          display: none;
        }
      }`}
      </style>
      <Header />
      <main>
      <div className="container">
        <div
          ref={calendarEl}
          className="mx-auto"
          style={{ marginTop: "5%", marginBottom: "510px" }}
        ></div>
      </div>
      </main>
      <Footer />
    </>
  );
}
