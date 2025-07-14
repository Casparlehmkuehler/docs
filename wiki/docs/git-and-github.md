# Git and GitHub

All of our code is hosted on GitHub. GitHub provides a number of configuration
options for enforcing certain development workflows. These are described here.

## Administrator

Currently Timo Nicolai (timo@lyceum.technology) manages our organization-wide
GitHub settings. This is subject to change.

## Teams

We have grouped all developers into different teams, currently:

* `backend`
* `frontend`
* `data`

This is subject to change. A single person can be part of multiple teams.
Certain permissions or capabilities may differ between teams but as of now this
is only used in conjunction with the `CODEOWNERS` file, see [pull
requests](#pull-requests).

## Repositories

Almost all of our code except potentially experimental one is committed into
one central monorepo (TODO: name tbd). This makes testing and deployment a lot
simpler.

## Pull Requests

A number of conditions have to be met in order for pull requests to be
mergeable, these are listed here alongside brief motivations. They hold for
all repositories and only the GitHub [administrator](#administrator) has the
permissions to overrule them. These restrictions only affect the default `main`
branch of each repository.

* Commits to `main` are only possible via a PR (self-explanatory).

* Relevant GitHub Action workflows must pass before a PR can be merged. The
  list of workflows depends on what code has been modified and is subject to
  change but in general this will include linting, unit tests, integration tests
  and so on.

* A PR needs to be approved before it can be merged. At least one reviewer must
  give their approval and pushing new changes to the PR will require re-approval.
  In addition, certain pieces of code are owned by certain people or teams as
  defined in `.github/CODEOWNERS` in the monorepo. If such code is modified at
  least one code owner has to give their approval.

* Commit history must be linear, meaning that no merge commits are allowed and
  you must rebase your PR on `main` before being able to merge. This is a
  matter of preference but the default for the majority of new-ish codebases.

* Commits must be signed, i.e. you have to generate a GPG key, register it with
  GitHub and then use it to sign your commits. If you are not already doing this
  your can set it up as follows:

        gpg --full-generate-key
        # Select "RSA and RSA"
        # Select key size 4096
        # Set expiry however desired, one year is recommended
        # Set full name and @lyceum.technology mail address
        # Set comment to "Lyceum git commit signing"

        git config --global user.signingkey <KEY-ID> # check gpg --list-keys
        git config --global commit.gpgsign true

        # Add export GPG_TTY=$(tty) to your .bashrc/.zshrc

        # Export your public key with `gpg --armor --export <KEY-ID>` and add
        # it to GitHub under Settings -> SSH and GPG keys -> New GPG key

  We require signing because it is trivial to set up and adds an additional
  level of trust.

## Actions

Our GitHub Actions workflows run automatically on PRs, pushes to `main` etc.
when certain parts of the code are changed. They handle linting, tests,
deployment and so on. We place some restriction on these runners as described
in this section.

### Workflow Permissions

Workflows currently only have read permissions for repositories (via
`GITHUB_TOKEN`). They can potentially be configured to have write permissions as
well as to create and approve pull requests.

### Third-Party Workflows

Using arbitrary third-party actions is dangerous and basically asking for a
supply-chain attack. We try to prevent this in two ways:

* We configure GitHub to allow only our own actions and reuseable workflows as
  well as a list of explicitly whitelisted actions, currently:

        astral-sh/setup-uv@* # i.e. @v5, @v6 and so on

  If you want to use a third-party action that is not on this list contact the
  GitHub [administrator](#administrator).

* Actions must always be pinned to a specific commit instead of just specifying
  a version number, e.g.:

        astral-sh/setup-uv@bd01e18f51369d5a26f1651c3cb451d3417e3bba # v6

### Workflow Runners

TODO: We currently still use GitHub's own workflow runners. We should switch
over to e.g. k8s-based runners on GCP to make use of our GCP credits and to
increase our control over runners.

### Workflow Environments/Secrets

Environment variables and secrets for use inside workflows should be defined at
the repo level (ask the [administrator](#administrator)). As a convention
prefix environment variables with `LYC_` if possible. Note that this is a
temporary solution since we might want more powerful secret management soon.
Note that it is possible to define secrets specific to so-called "environments"
(e.g. testing, production and so on) although we don't yet use this feature.

## API

It is possible to access repositories, packages etc. via the GitHub API. This
requires credentials of which there exist several variants:

* GitHub Apps: Entities which can be given the necessary permisions to
  read/write repositories etc. These can potentially be used inside CICD jobs.
  Ask the [administrator](#administrator) if you believe you require such an
  app.

* Deploy keys: We disable these in favor of apps.

* Tokens: Every user can create tokens with varying permissions that can be
  used to access the GitHub API. Since these have a habit of being stored in
  plaintext, their creation is subject to approval from the
  [administrator](#administrator) and they must expire after one day. If you
  need a token to be valid indefinitely you are going to want to create an app
  instead.

## Slack Integration

GitHub should send reminders to the `github-pr-reminders` Slack channel if there
is no response to a PR, a PR review or a re-review request within an hour. These
reminders are sent out once every full hour from 9am to 6pm.

## TBD

There are topics that are not yet covered here that we will still have to think
about:

* Do we use our private GitHub accounts to work on Lyceum code?
* How can we add sensible Git Hooks (or similar) to enfore certain commit
  messages etc.
* Do we want to introduce restricted branches other than `main`? E.g. `devel`
  for active development  with `main` always containing the currently deployed
  code.
* How do we handle releases for code shipped to users (SDK, plugin etc.)?
* Do we want to use code scanning, dependabot, copilot or any other
  GitHub-specific features?
* Do we want to use GitHub packages? Or do we host our Docker images elsewhere?
