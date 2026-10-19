import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import { registerSchema, type RegisterInput } from "@resume-fit/shared";
import { useAppDispatch } from "../../hooks";
import { register as registerThunk } from "../../store";
import { getErrorMessage } from "../../utils";

export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterInput) {
    setFormError(null);
    try {
      await dispatch(registerThunk(values)).unwrap();
      navigate("/login", { state: { registered: true } });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <div className="centered-page">
      <div className="card-section auth-card">
        <h2>Create your Resume-Fit account</h2>

        {formError && <Message severity="error" text={formError} style={{ width: "100%", marginBottom: 16 }} />}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field-group">
            <label htmlFor="name">Name</label>
            <InputText id="name" {...registerField("name")} aria-invalid={!!errors.name} />
            {errors.name && <span className="field-error">{errors.name.message}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <InputText id="email" type="email" {...registerField("email")} aria-invalid={!!errors.email} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Password
                  inputId="password"
                  toggleMask
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  aria-invalid={!!errors.password}
                />
              )}
            />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <Button
            type="submit"
            label={isSubmitting ? "Creating account..." : "Create account"}
            disabled={isSubmitting}
            style={{ width: "100%" }}
          />
        </form>

        <p className="text-secondary" style={{ marginTop: 16, textAlign: "center" }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
