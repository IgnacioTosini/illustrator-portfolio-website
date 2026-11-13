'use client'

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IoAlertCircleOutline, IoCheckmarkCircleOutline, IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import { trackEvent } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";
import './_contactForm.scss'

type Inputs = {
    name: string;
    email: string;
    message: string;
}

export const ContactForm = () => {
    const { t } = useLanguage();
    const shouldReduceMotion = useReducedMotion();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const sending = submitState === 'sending';

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setSubmitState('sending');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok || !result.ok) {
                throw new Error(result.error || t("contactForm.sendErrorFallback"))
            }

            trackEvent('form_submit', {
                form_name: 'contact_form',
                location: 'contact_section',
            })

            toast.success(t("contactForm.successToast"))
            setSubmitState('success');
        } catch {
            toast.error(t("contactForm.errorToast"))
            setSubmitState('error');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`contactForm is-${submitState}`} aria-busy={sending}>
            <div className="field">
                <label>{t("contactForm.nameLabel")}</label>
                <input
                    {...register("name", { required: t("contactForm.nameRequired") })}
                    placeholder={t("contactForm.namePlaceholder")}
                />
                {errors.name && <span className="error">{errors.name.message}</span>}
            </div>

            <div className="field">
                <label>{t("contactForm.emailLabel")}</label>
                <input
                    {...register("email", {
                        required: t("contactForm.emailRequired"),
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: t("contactForm.emailInvalid")
                        }
                    })}
                    placeholder={t("contactForm.emailPlaceholder")}
                />
                {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            <div className="field">
                <label>{t("contactForm.messageLabel")}</label>
                <textarea
                    {...register("message", { required: t("contactForm.messageRequired") })}
                    placeholder={t("contactForm.messagePlaceholder")}
                />
                {errors.message && <span className="error">{errors.message.message}</span>}
            </div>

            <button type="submit" disabled={sending} className="contactSubmitButton">
                <span>{sending ? t("contactForm.sending") : submitState === 'success' ? t("contactForm.sent") : submitState === 'error' ? t("contactForm.tryAgain") : t("contactForm.submit")}</span>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={submitState === 'sending' ? 'sending' : submitState === 'success' ? 'success' : 'send'}
                        className={`contactSubmitIcon is-${submitState}`}
                        initial={shouldReduceMotion ? false : { opacity: 0, scale: .65, rotate: -18 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0, scale: .7, rotate: 18 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 24 }}
                        aria-hidden="true"
                    >
                        {sending ? <span className="contactSubmitSpinner" /> : submitState === 'success' ? <IoCheckmarkCircleOutline /> : <IoSend />}
                    </motion.span>
                </AnimatePresence>
            </button>
            <AnimatePresence initial={false} mode="wait">
                {(submitState === 'success' || submitState === 'error') && (
                    <motion.p
                        key={submitState}
                        className={`contactSubmitFeedback is-${submitState}`}
                        role={submitState === 'error' ? 'alert' : 'status'}
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: .24, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {submitState === 'success' ? <IoCheckmarkCircleOutline aria-hidden="true" /> : <IoAlertCircleOutline aria-hidden="true" />}
                        <span>{submitState === 'success' ? t('contactForm.successFeedback') : t('contactForm.errorFeedback')}</span>
                    </motion.p>
                )}
            </AnimatePresence>
        </form>
    )
}
