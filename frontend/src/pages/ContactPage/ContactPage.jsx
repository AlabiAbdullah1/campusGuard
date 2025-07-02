import ContactForm from '../../components/ContactForm/ContactForm';


export const ContactPage = () => {

  return (
    <div className="contact-page">
      <div className="wrapper">

        <div className="contact-us">
          <ContactForm />
          <p>
            If you have any queries, feel free to contact us via email or phone.
          </p>
          <ul>
            <li>
              <span>Email: </span>abdullahialabi@gmail.com
            </li>
            <li>
              <span>Phone: </span>123-456789
            </li>
            <li>
              <span>Address: </span>University of Ilorin
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

