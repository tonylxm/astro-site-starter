import { ActionError, defineAction } from "astro:actions";
import {
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
  RESEND_API_KEY,
} from "astro:env/server";
import { z } from "astro/zod";
import { Resend } from "resend";

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().trim().min(1, "Enter your name.").max(100),
      email: z.email("Enter a valid email address."),
      message: z
        .string()
        .trim()
        .min(10, "Write at least 10 characters.")
        .max(5000),
      // Honeypot: hidden from people, filled in by most bots.
      company: z.string().nullish(),
    }),
    handler: async ({ name, email, message, company }) => {
      // Pretend it worked so bots don't learn to skip the field.
      if (company) return { sent: true };

      const resend = new Resend(RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL,
        replyTo: email,
        subject: `Website enquiry from ${name}`,
        text: `${message}\n\n${name} <${email}>`,
      });
      if (error) {
        console.error("Resend failed", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "The message could not be sent.",
        });
      }
      return { sent: true };
    },
  }),
};
