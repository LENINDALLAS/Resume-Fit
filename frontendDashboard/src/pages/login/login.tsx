import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import { loginSchema, type LoginInput } from "@resume-fit/shared";
import { useAppDispatch } from "../../hooks";
import { login } from "../../store";
import { getErrorMessage } from "../../utils";

export function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    try {
      await dispatch(login(values)).unwrap();
      const intendedPath =
        (location.state as { from?: string } | null)?.from ?? "/";
      navigate(intendedPath, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <div className="centered-page">
      <div className="card-section auth-card">
        <h2>Log in to Resume-Fit</h2>

        {formError && (
          <Message
            severity="error"
            text={formError}
            style={{ width: "100%", marginBottom: 16 }}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              {...registerField("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Password
                  inputId="password"
                  feedback={false}
                  toggleMask
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  aria-invalid={!!errors.password}
                />
              )}
            />
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </div>

          <Button
            type="submit"
            label={isSubmitting ? "Logging in..." : "Login"}
            disabled={isSubmitting}
            style={{ width: "100%" }}
          />
        </form>

        <p
          className="text-secondary"
          style={{ marginTop: 16, textAlign: "center" }}
        >
          Don&apos;t have an account? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}
