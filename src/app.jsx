import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import ContactForm from './contact.jsx';

const buttonsInstance = (
  <Button>Click me!</Button>
);

$(document).ready(function () {
    // ReactDOM.render(buttonsInstance, document.getElementById('here'));
    ReactDOM.render(<ContactForm />, document.getElementById('contact'));
});