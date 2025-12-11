---
title: Claude (Haiku 4.5) Default
model: claude/haiku-4.5
scope: all-clients
default: true
description: |
  This file configures the project's default Claude model to "Haiku 4.5" for
  all client integrations that consult repository agent configuration. Use the
  environment variable `SPECIFY_AGENT` or the `.specify` scripts to override
  per-client or per-run settings.

usage:
  - To use this model locally when running specify scripts:
      export SPECIFY_AGENT=claude:haiku-4.5
  - To override for a single run (POSIX):
      SPECIFY_AGENT=claude:haiku-4.5 ./.specify/scripts/bash/update-agent-context.sh claude

notes: |
  - This file is consulted by `.specify/scripts/bash/update-agent-context.sh`.
  - If your deployment platform (Anthropic, internal gateway, or other) needs
    a specific feature flag or admin setting enabled, also ensure your service
    account or org-level settings allow the `haiku-4.5` model.
  - Creating this file does not change external provider settings; it only
    documents and configures the repository-level default.

---

## Model: Claude Haiku 4.5

Repository default model: `claude/haiku-4.5` (enabled for all clients by
default when agent tooling reads `CLAUDE.md`).

If you'd like me to also update deployment configs, CI/CD, or any platform
admin settings (Anthropic org settings, feature flags, or API calls) tell me
which system and I can prepare the exact steps or automate them if you provide
access.
