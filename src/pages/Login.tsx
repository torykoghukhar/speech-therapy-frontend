import React from "react";
import { useState } from "react";
import { publicApi } from "../api/publicApi";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Auth.css";
import { AxiosError } from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      delete updated.non_field_errors;
      return updated;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await publicApi.post("api/login/", formData);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      navigate("/dashboard");
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
          const backendErrors = error.response?.data;

        if (backendErrors?.non_field_errors) {
            setErrors({
            non_field_errors: backendErrors.non_field_errors[0],
            });
        } else {
            setErrors({
            non_field_errors: "Login failed. Please try again.",
            });
        }
     }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="SoundSteps" className="auth-logo" />

        <h2>Welcome Back</h2>
        <p className="auth-subtitle">
          Sign in to continue your speech training journey
        </p>

        <form onSubmit={handleLogin} noValidate>

        <div className="input-group">
            <label>Email</label>
            <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={
                errors.email || errors.non_field_errors ? "error" : ""
            }
            />
            {errors.email && (
            <span className="error-text">{errors.email}</span>
            )}
        </div>

        <div className="input-group">
            <label>Password</label>
            <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={
                errors.password || errors.non_field_errors ? "error" : ""
            }
            />
            {errors.password && (
            <span className="error-text">{errors.password}</span>
            )}
        </div>

        {errors.non_field_errors && (
            <span className="error-text role-error">
            {errors.non_field_errors}
            </span>
        )}

        <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
        </button>

        </form>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
        <p className="auth-footer">
          <span onClick={() => navigate("/forgot-password")}>Forgot password?</span>
        </p>
      </div>
    </div>
  );
}
