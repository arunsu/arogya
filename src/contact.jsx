'use strict';
var React = require('react');

class ContactForm extends React.Component{
  /**
   * Renders the component.
   * https://facebook.github.io/react/docs/component-specs.html#render
   */
  render() {
    return (
      <div className="row">
      <div className="col-lg-8 mb-4">
        <h3 id="heading">Send us a Message</h3>
        <form action="" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your full name *</label>
            <input className="form-control" name="name" ref="name" required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your email address *</label>
            <input className="form-control" name="email" ref="email" required type="email" />
          </div>
          <div className="form-group">
            <label htmlFor="company">Your company *</label>
            <input className="form-control" name="company" ref="company" required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Your phone number *</label>
            <input className="form-control" name="phone" ref="phone" required type="phone" />
          </div>

          <div className="form-group">
            <label htmlFor="referral">How did you hear about us&#63;</label>
            <input className="form-control" name="referal" ref="referal" type="text" />
          </div>

          <div className="form-group">
            <button className="btn btn-primary" type="submit">Contact Us</button>
          </div>
        </form>
      </div>
      <div className="col-lg-4 mb-4">
        <h3>Contact Details</h3>
        <p>
          3481 Melrose Place
          <br/>
          Beverly Hills, CA 90210
          <br/>
        </p>
        <p>
          <abbr title="Phone">P</abbr>: (123) 456-7890
        </p>
        <p>
          <abbr title="Email">E</abbr>:
          <a href="mailto:name@example.com">name@example.com
          </a>
        </p>
        <p>
          <abbr title="Hours">H</abbr>: Monday - Friday: 9:00 AM to 5:00 PM
        </p>
      </div>
      </div>
    );
  }
};

module.exports = ContactForm;