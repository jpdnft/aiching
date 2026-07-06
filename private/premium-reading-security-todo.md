# Premium Reading Security To-Do

## Premium Reading API

- [ ] Add server-side entitlement verification before `generatePremiumReadingOnServer()` calls OpenAI.
- [ ] Use a server-only `REVENUECAT_SECRET_API_KEY` to verify the caller's active `premium` entitlement with RevenueCat.
- [ ] Avoid using client-side premium flags, static app secrets, or app-bundled tokens as the main security layer.
- [ ] Add server-side premium reading usage limits by user/customer ID.
- [ ] Keep the current IP rate limit, but treat it as secondary protection only.
- [ ] Require an authorization header for premium readings, such as `Authorization: Bearer <session-token>`.
- [ ] Validate the session token server-side, map it to a RevenueCat customer, check entitlement, check quota, then call OpenAI.
- [ ] Add request logging for timestamp, user/customer ID, IP, model, success/failure, and request count.
- [ ] Avoid logging full user questions unless we intentionally want to retain that data.
- [ ] Add abuse alerts for suspicious spikes, repeated rejected attempts, or unusually high usage by one user/IP.
- [ ] Continue constraining request shape: hexagram number, cast details, question length, personality, and theme.
- [ ] Consider requiring `readingId` and rejecting duplicate generation for the same user/reading unless retrying a failed request.
- [ ] Set `AI_READING_ALLOWED_ORIGIN` to the real web origin instead of `*` for browser hygiene.

## Testing Access

- [ ] Add a server-only test bypass such as `AI_READING_TEST_BYPASS_TOKEN`, restricted to non-production or explicitly enabled environments.
- [ ] Prefer RevenueCat sandbox/test entitlements for end-to-end purchase testing.
- [ ] Add a dev/review mode such as `ALLOW_AI_READING_TEST_ACCESS=true` for controlled testing.
- [ ] Keep all test credentials out of `EXPO_PUBLIC_*` environment variables.
- [ ] Add a mock mode such as `AI_READING_MOCK_RESPONSE=true` so UI tests can avoid calling OpenAI.

## OpenAI Cost Controls

- [ ] Disable OpenAI auto recharge unless we intentionally want automatic top-ups.
- [ ] Keep a low prepaid balance as a secondary exposure limit.
- [ ] Do not rely on a `$0` balance as the only guardrail because cutoff can be delayed.
- [ ] Put this app's OpenAI usage in its own OpenAI project if available.
- [ ] Use a dedicated OpenAI API key for this app only.
- [ ] Set project/API budgets or usage limits in the OpenAI dashboard if available.
- [ ] Keep the reading model conservative and cost-appropriate.
- [ ] Add an explicit output token limit for premium reading responses.
- [ ] Add a global server-side kill switch such as `AI_READING_ENABLED=false`.
- [ ] Add a global daily cap across the whole service, either by estimated spend or request count.
- [ ] Monitor OpenAI usage daily after launch and during the first week after any security changes.
- [ ] Rotate the dedicated OpenAI API key if endpoint abuse is suspected.

## Suggested Implementation Order

1. Add server-side RevenueCat entitlement verification.
2. Add server-side per-user usage limits.
3. Add mock/test access paths that do not expose secrets in the app bundle.
4. Move this app to a dedicated OpenAI key/project.
5. Disable auto recharge and configure OpenAI-side budget controls.
6. Add logging, alerts, global caps, and the kill switch.
