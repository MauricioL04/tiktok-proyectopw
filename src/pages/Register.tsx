// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, findUserByEmail, findUserByUsername, setActiveUser } from "../utils/storage";
import { passwordMeetsRules, usernameAllowed } from "../utils/validators";
import "./Login.css";

export default function Register() {
  const navigate = useNavigate();

  // control de pasos: 1 = nacimiento/contacto, 2 = código, 3 = credenciales
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // paso 1: nacimiento y contacto
  const [dob, setDob] = useState("");
  const [usePhone, setUsePhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // paso 2: código simulado
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");

  // paso 3: credenciales
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState<string | null>(null);

  // función para validar edad mínima
  const isOldEnough = () => {
    if (!dob) return false;
    const birth = new Date(dob);
    const age = (Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 13;
  };

  // enviar código (simulado)
  const sendCode = () => {
    if (!dob) { setErrors("Selecciona tu fecha de nacimiento"); return; }
    if (!isOldEnough()) { setErrors("Debes tener al menos 13 años para registrarte"); return; }
    if (!usePhone && !email) { setErrors("Ingresa un correo electrónico"); return; }
    if (usePhone && !phone) { setErrors("Ingresa un número de teléfono"); return; }

    setErrors(null);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    alert(`Código simulado: ${code} (en una app real se enviaría por SMS o email)`);
    setStep(2);
  };

  // verificar código (simulado)
  const verifyCode = () => {
    if (!sentCode) return;
    if (codeInput.trim() === sentCode) {
      setStep(3);
      setErrors(null);
    } else {
      setErrors("Código incorrecto");
    }
  };

  // completar registro
  const finishRegister = () => {
    setErrors(null);
    if (!name.trim()) { setErrors("Ingresa tu nombre completo"); return; }
    if (!usernameAllowed(username)) { setErrors("Usuario inválido (solo letras, números y guion bajo, 3–24 caracteres)"); return; }
    if (findUserByUsername(username)) { setErrors("Ese nombre de usuario ya existe"); return; }
    const pwRules = passwordMeetsRules(password);
    if (!pwRules.ok) { setErrors("La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula y número"); return; }
    if (password !== password2) { setErrors("Las contraseñas no coinciden"); return; }
    if (email && findUserByEmail(email)) { setErrors("Ya existe una cuenta con ese correo"); return; }

    // crear usuario
    const newUser = createUser({
      name: name.trim(),
      username: username.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      dob,
      password
    });

    // marcar como activo
    setActiveUser(newUser);
    window.dispatchEvent(new CustomEvent("userChanged"));
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-form" style={{ width: 420 }}>
        <h2>Registrarse</h2>

        {step === 1 && (
          <>
            <p>¿Cuál es tu fecha de nacimiento? (no se mostrará públicamente)</p>
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
            />

            <p style={{ marginTop: 12 }}>Método de registro</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button
                type="button"
                onClick={() => setUsePhone(false)}
                style={{
                  flex: 1,
                  background: !usePhone ? "#ff0050" : "#333",
                  color: "#fff",
                  padding: 8
                }}
              >
                Correo
              </button>
              <button
                type="button"
                onClick={() => setUsePhone(true)}
                style={{
                  flex: 1,
                  background: usePhone ? "#ff0050" : "#333",
                  color: "#fff",
                  padding: 8
                }}
              >
                Teléfono
              </button>
            </div>

            {!usePhone ? (
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            ) : (
              <input
                type="tel"
                placeholder="Teléfono (ej: +51 9xxxxxxx)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            )}

            <button style={{ marginTop: 12 }} onClick={sendCode}>
              Enviar código
            </button>
            <p style={{ fontSize: 12, opacity: 0.8 }}>
              Se enviará un código de 6 dígitos (simulado)
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <p>Ingresa el código de 6 dígitos que recibiste</p>
            <input
              placeholder="Código"
              value={codeInput}
              onChange={e => setCodeInput(e.target.value)}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={verifyCode}>Verificar</button>
              <button
                onClick={() => {
                  setStep(1);
                  setSentCode(null);
                }}
              >
                Reenviar
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <label>Nombre completo</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre"
            />

            <label>Nombre de usuario</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="usuario_unico"
            />

            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
            />

            <label>Repite la contraseña</label>
            <input
              type="password"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              placeholder="Repite la contraseña"
            />

            <button style={{ marginTop: 12 }} onClick={finishRegister}>
              Crear cuenta
            </button>
          </>
        )}

        {errors && (
          <div style={{ marginTop: 10, color: "salmon" }}>{errors}</div>
        )}

        <p style={{ marginTop: 12 }}>
          ¿Ya tienes cuenta?{" "}
          <span
            style={{ color: "#ff0050", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </span>
        </p>
      </div>
    </div>
  );
}
