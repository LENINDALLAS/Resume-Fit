import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@resume-fit/shared";
import { useAppDispatch } from "../../hooks";
import { login, registerAndLogin } from "../../store";
import { getErrorMessage } from "../../utils";

interface ClaimPromptProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

export function ClaimPrompt({ onAuthenticated, onCancel }: ClaimPromptProps) {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formError, setFormError] = useState<string | null>(null);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function handleLogin(values: LoginInput) {
    setFormError(null);
    try {
      await dispatch(login(values)).unwrap();
      onAuthenticated();
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  async function handleRegister(values: RegisterInput) {
    setFormError(null);
    try {
      await dispatch(registerAndLogin(values)).unwrap();
      onAuthenticated();
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <div className="card-section">
      <p style={{ marginTop: 0 }}>
        {mode === "login" ? "Log in" : "Create an account"} to view missing keywords and suggestions on the
        dashboard.
      </p>

      {formError && <Message severity="error" text={formError} style={{ width: "100%", marginBottom: 12 }} />}

      {mode === "login" ? (
        <form onSubmit={loginForm.handleSubmit(handleLogin)} noValidate>
          <div className="field-group">
            <label htmlFor="claim-email">Email</label>
            <InputText
              id="claim-email"
              type="email"
              {...loginForm.register("email")}
              aria-invalid={!!loginForm.formState.errors.email}
            />
            {loginForm.formState.errors.email && (
              <span className="field-error">{loginForm.formState.errors.email.message}</span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="claim-password">Password</label>
            <Controller
              name="password"
              control={loginForm.control}
              render={({ field }) => (
                <Password
                  inputId="claim-password"
                  feedback={false}
                  toggleMask
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  aria-invalid={!!loginForm.formState.errors.password}
                />
              )}
            />
            {loginForm.formState.errors.password && (
              <span className="field-error">{loginForm.formState.errors.password.message}</span>
            )}
          </div>

          <Button
            type="submit"
            label={loginForm.formState.isSubmitting ? "Logging in..." : "Log in"}
            disabled={loginForm.formState.isSubmitting}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </form>
      ) : (
        <form onSubmit={registerForm.handleSubmit(handleRegister)} noValidate>
          <div className="field-group">
            <label htmlFor="claim-name">Name</label>
            <InputText
              id="claim-name"
              {...registerForm.register("name")}
              aria-invalid={!!registerForm.formState.errors.name}
            />
            {registerForm.formState.errors.name && (
              <span className="field-error">{registerForm.formState.errors.name.message}</span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="claim-register-email">Email</label>
            <InputText
              id="claim-register-email"
              type="email"
              {...registerForm.register("email")}
              aria-invalid={!!registerForm.formState.errors.email}
            />
            {registerForm.formState.errors.email && (
              <span className="field-error">{registerForm.formState.errors.email.message}</span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="claim-register-password">Password</label>
            <Controller
              name="password"
              control={registerForm.control}
              render={({ field }) => (
                <Password
                  inputId="claim-register-password"
                  toggleMask
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  aria-invalid={!!registerForm.formState.errors.password}
                />
              )}
            />
            {registerForm.formState.errors.password && (
              <span className="field-error">{registerForm.formState.errors.password.message}</span>
            )}
          </div>

          <Button
            type="submit"
            label={registerForm.formState.isSubmitting ? "Creating account..." : "Create account"}
            disabled={registerForm.formState.isSubmitting}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </form>
      )}

      <Button
        label={mode === "login" ? "Create an account instead" : "Log in instead"}
        text
        size="small"
        style={{ width: "100%", marginBottom: 4 }}
        onClick={() => {
          setFormError(null);
          setMode(mode === "login" ? "register" : "login");
        }}
      />
      <Button label="Cancel" text size="small" style={{ width: "100%" }} onClick={onCancel} />
    </div>
  );
}
