import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    try {
      await dispatch(login(values)).unwrap();
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <div className="popup-content">
      <h2 style={{ marginTop: 0 }}>Resume-Fit</h2>
      <p className="text-secondary" style={{ marginTop: -8 }}>
        Log in to analyze your resume.
      </p>

      {formError && <Message severity="error" text={formError} style={{ width: "100%", marginBottom: 12 }} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field-group">
          <label htmlFor="email">Email</label>
          <InputText id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
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
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </div>

        <Button
          type="submit"
          label={isSubmitting ? "Logging in..." : "Login"}
          disabled={isSubmitting}
          style={{ width: "100%" }}
        />
      </form>
    </div>
  );
}
