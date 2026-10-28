import './_login.scss';
import Link from 'next/link';

interface Props {
    searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
    const { error } = await searchParams;

    return (
        <main className="loginContainer">
            <section className="loginPanel" aria-labelledby="login-title">
                <Link href="/" className="loginBrand" aria-label="Alukkart, ir al inicio">
                    <span className="brandMark">A</span>
                    <span>Alukkart</span>
                </Link>

                <div className="loginIntro">
                    <span className="loginEyebrow">ÁREA PRIVADA</span>
                    <h1 id="login-title">Bienvenido de nuevo</h1>
                    <p>Ingresa tu clave para administrar el portfolio.</p>
                </div>

                <form action="/api/auth/login" method="POST" className="loginForm">
                    <label htmlFor="access-key">Clave de acceso</label>
                    <input
                        id="access-key"
                        type="password"
                        name="key"
                        placeholder="Escribe tu clave"
                        autoComplete="current-password"
                        required
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? 'login-error' : undefined}
                    />
                    <button type="submit" className="submitButton">
                        Entrar al dashboard <span aria-hidden="true">→</span>
                    </button>
                </form>

                {error && <p id="login-error" className="error-message" role="alert">La clave ingresada no es correcta. Inténtalo de nuevo.</p>}

                <Link href="/" className="backHome">← Volver al portfolio</Link>
            </section>
            <p className="loginFootnote">Acceso exclusivo para administración</p>
        </main>
    );
}
