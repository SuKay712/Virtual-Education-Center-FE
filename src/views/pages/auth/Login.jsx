import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useAuth } from "../../../contexts/AccountContext";
import authAPI from "../../../api/auth";
import "./auth.scss";

const Login = () => {
  const navigate = useNavigate();
  const { setAccount, setToken } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.login(formData);
      const accessToken = res.data.acess_token;
      const userInfo = {
        name: res.data.name,
        address: res.data.address,
        avatar: res.data.avatar,
        phone: res.data.tel,
        gender: res.data.gender,
        email: res.data.email,
        role: res.data.role,
        birthday: res.data.birthday,
      };

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("user_info", JSON.stringify(userInfo));
        setToken(accessToken);
        setAccount(userInfo);
        setTimeout(() => {
          if (userInfo.role === "Student") {
            navigate("/student/overview");
          } else {
            navigate("/admin/dashboard");
          }
        }, 2000);
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Container className="auth-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={5}>
          <Card className="auth-card">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
              <div className="text-center mt-3">
                <p>
                  Don't have an account?{" "}
                  <a href="/register" className="text-primary">
                    Register here
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
