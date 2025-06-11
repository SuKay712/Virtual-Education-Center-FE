import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useAuth } from "../../../contexts/AccountContext";
import authAPI from "../../../api/auth";
import "./auth.scss";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { setAccount, setToken } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
        id: res.data.id,
        name: res.data.name,
        address: res.data.address,
        avatar: res.data.avatar,
        phone: res.data.phone,
        gender: res.data.gender,
        email: res.data.email,
        role: res.data.role,
        birthday: res.data.birthday,
        address: res.data.address,
      };

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("user_info", JSON.stringify(userInfo));
        setToken(accessToken);
        setAccount(userInfo);
        toast.success("Login successfully", {
          autoClose: 1500,
          onClose: () => {
            if (userInfo.role === "Student") {
              navigate("/student/overview");
            } else if (userInfo.role === "Teacher") {
              navigate("/teacher/overview");
            } else if (userInfo.role === "Admin") {
              navigate("/admin/accounts");
            }
          },
        });
      }
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <Container className="auth-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={5}>
          <Card className="auth-card">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
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
