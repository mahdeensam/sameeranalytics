import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Icon } from '~/components/icon';
import { Input } from '~/components/input';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { useFormInput } from '~/hooks';
import { useRef, useEffect } from 'react';
import { cssProps, msToNum, numToMs } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { json } from '@remix-run/cloudflare';
import styles from './contact.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Contact',
    description: 
    "Send me a message if you're interested in discussing a project or if you just want to say hi",
  });
};

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 4096;
const LINKEDIN_URL = 'https://www.linkedin.com/in/mahdeen-sameer-khan-892739232/';

export async function action({ request }) {
  const formData = await request.formData();
  const isBot = String(formData.get('email')); // Using email field as honeypot
  const name = String(formData.get('name') || '');
  const message = String(formData.get('message'));
  const errors = {};

  // Return without sending if a bot trips the honeypot
  if (isBot) return json({ success: true });

  // Handle input validation
  if (!name) {
    errors.name = 'Please enter your name.';
  }

  if (!message) {
    errors.message = 'Please enter a message.';
  }

  if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Name must be shorter than ${MAX_NAME_LENGTH} characters.`;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be shorter than ${MAX_MESSAGE_LENGTH} characters.`;
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  // Prepare LinkedIn redirect with message context
  // LinkedIn doesn't support direct messaging via URL parameters,
  // so we'll just redirect to the profile
  return json({ 
    success: true, 
    redirect: LINKEDIN_URL,
    message: "You'll be redirected to LinkedIn to send your message directly."
  });
}

export const Contact = () => {
  const errorRef = useRef();
  const name = useFormInput('');
  const message = useFormInput('');
  const initDelay = tokens.base.durationS;
  const actionData = useActionData();
  const { state } = useNavigation();
  const sending = state === 'submitting';

  // Handle LinkedIn redirect if applicable
  useEffect(() => {
    if (actionData?.redirect) {
      window.open(actionData.redirect, '_blank');
    }
  }, [actionData]);

  return (
    <Section className={styles.contact}>
      <Transition unmount in={!actionData?.success} timeout={1600}>
        {({ status, nodeRef }) => (
          <Form className={styles.form} method="post" ref={nodeRef}>
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText text="Connect with me" start={status !== 'exited'} delay={300} />
            </Heading>
            <Divider className={styles.divider} data-status={status} />

            {/* LinkedIn Profile Link */}
            <div className={styles.socialLinks} data-status={status} style={getDelay(tokens.base.durationXS, initDelay, 0.4)}>
              <Text size="m" as="p" className={styles.contactDescription}>
                Fill out this form to prepare your message. You'll be redirected to LinkedIn to send it directly.
              </Text>
              <a 
                href={LINKEDIN_URL}
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.linkedinLink}
              >
                <Icon icon="linkedin" />
                <span>View my LinkedIn Profile</span>
              </a>
            </div>

            {/* Hidden honeypot field to block bots */}
            <Input className={styles.botkiller} label="Email" name="email" />

            <Input
              required
              className={styles.input}
              data-status={status}
              label="Your name"
              type="text"
              name="name"
              maxLength={MAX_NAME_LENGTH}
              {...name}
            />
            
            <Input
              required
              multiline
              className={styles.input}
              data-status={status}
              autoComplete="off"
              label="Your message"
              name="message"
              maxLength={MAX_MESSAGE_LENGTH}
              {...message}
            />

            <Transition unmount in={!sending && actionData?.errors} timeout={msToNum(tokens.base.durationM)}>
              {({ status: errorStatus, nodeRef }) => (
                <div className={styles.formError} ref={nodeRef} data-status={errorStatus}>
                  <div className={styles.formErrorContent} ref={errorRef}>
                    <div className={styles.formErrorMessage}>
                      <Icon className={styles.formErrorIcon} icon="error" />
                      {actionData?.errors?.name}
                      {actionData?.errors?.message}
                      {actionData?.errors?.submit}
                    </div>
                  </div>
                </div>
              )}
            </Transition>

            <Button
              className={styles.button}
              data-status={status}
              data-sending={sending}
              disabled={sending}
              loading={sending}
              loadingText="Preparing LinkedIn..."
              icon="linkedin"
              type="submit"
            >
              Continue to LinkedIn
            </Button>
          </Form>
        )}
      </Transition>

      <Transition unmount in={actionData?.success}>
        {({ status, nodeRef }) => (
          <div className={styles.complete} aria-live="polite" ref={nodeRef}>
            <Heading level={3} as="h3" className={styles.completeTitle} data-status={status}>
              LinkedIn Message
            </Heading>
            <Text size="l" as="p" className={styles.completeText} data-status={status}>
              {actionData?.message || "You've been redirected to LinkedIn to send your message."}
            </Text>
            <Button
              secondary
              iconHoverShift
              className={styles.completeButton}
              data-status={status}
              href={LINKEDIN_URL}
              icon="linkedin"
              target="_blank"
            >
              Open LinkedIn Again
            </Button>
          </div>
        )}
      </Transition>

      <Footer className={styles.footer} />
    </Section>
  );
};

// Utility function for animation delays
function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}

export default Contact;