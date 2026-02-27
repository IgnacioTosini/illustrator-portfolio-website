'use client'

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { LuSend } from "react-icons/lu";
import { toast } from "react-toastify";
import './_contactForm.scss'

type Inputs = {
    name: string;
    email: string;
    message: string;
}

export const ContactForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const [sending, setSending] = useState(false)

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setSending(true)

            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok || !result.ok) {
                throw new Error(result.error || 'Error al enviar')
            }

            toast.success('Mensaje enviado correctamente ✅')
        } catch {
            toast.error('No se pudo enviar el mensaje')
        } finally {
            setSending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="contactForm">
            <div className="field">
                <label>NOMBRE</label>
                <input
                    {...register("name", { required: "El nombre es requerido" })}
                    placeholder="Tu nombre"
                />
                {errors.name && <span className="error">{errors.name.message}</span>}
            </div>

            <div className="field">
                <label>CORREO</label>
                <input
                    {...register("email", {
                        required: "El email es requerido",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Email inválido"
                        }
                    })}
                    placeholder="tu@correo.com"
                />
                {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            <div className="field">
                <label>MENSAJE</label>
                <textarea
                    {...register("message", { required: "El mensaje es requerido" })}
                    placeholder="Cuentame sobre tu proyecto..."
                />
                {errors.message && <span className="error">{errors.message.message}</span>}
            </div>

            <button type="submit" disabled={sending}>
                <span>{sending ? 'Enviando...' : 'Enviar Mensaje'}</span>
                <LuSend className='icon' />
            </button>
        </form>
    )
}
