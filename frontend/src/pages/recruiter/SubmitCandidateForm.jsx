import React from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

export default function SubmitCandidateModal({
  show,
  handleClose,
  formData,
  loading,
  handleChange,
  handleFileChange,
  handleSubmit,
  requirement,
  leads,
  handleLeadSelect,
}) {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Candidate for {requirement?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Candidate Name <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Role <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Email <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Phone <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Source</Form.Label>
            <Form.Control
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Current Location <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Rate <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Relocation <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="relocation"
              value={formData.relocation}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Passport Number</Form.Label>
            <Form.Control
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Last 4 digits SSN <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="last4SSN"
              value={formData.last4SSN}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Visa Status <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="visaStatus"
              value={formData.visaStatus}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>LinkedIn URL</Form.Label>
            <Form.Control
              type="text"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Client Details <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="clientDetails"
              value={formData.clientDetails}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Resume Files <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
          </Form.Group>

          <div className="mb-3">
            <label className="fw-bold">Assign to Leads:</label>
            <div className="d-flex flex-wrap">
              {leads.length === 0 ? (
                <p className="text-muted">No leads available</p>
              ) : (
                leads.map((lead) => (
                  <div key={lead.email} className="form-check me-3 mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`lead-${lead.email}`}
                      checked={formData.forwardToLeads?.includes(lead.email)}
                      onChange={() => handleLeadSelect(lead.email)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`lead-${lead.email}`}
                    >
                      {lead.username || lead.email}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              "Submit Candidate"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
