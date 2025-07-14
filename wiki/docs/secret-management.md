# Secret Management

To share secrets (service passwords, SSH private keys for cloud machine etc.)
we currently use a Git-versioned [pass](https://www.passwordstore.org) store.
This is a quite basic solution, in particular because it requires manual key
management, updates and is not suitable for use with CICD. In the near future
we should look into setting up e.g. HashiCorp Vault for important secrets.

## Initializing the Password Store

The password store is already stored on GitHub, to replicate this setup from
scratch you can do the following:

1. Ask all team members to generate a GPG key, e.g. as follows:

        gpg --full-generate-key
        # Select "RSA and RSA"
        # Select key size 4096
        # Set expiry however desired, one year is recommended
        # Set full name and @lyceum.technology mail address
        # Set comment to "Lyceum pass store"

   They can then determine the generated key's ID via `gpg --list-keys` and
   export it with `gpg --armor --export <KEY-ID>`.

2. Import each team member's GPG key. They should each provide you with a
   `public_key.gpg` file containing their public key, generated as described
   above.  You can import these with `gpg --import public_key.gpg`.

3. Initialize `pass`, providing each team members GPG key ID:

        pass init <KEY-ID-1> <KEY-ID-2> ...

4. Push the password store to an existing Git repository:

        pass git init
        pass git branch -m main
        pass git remote add origin <PASS-REPO> # E.g. git@github.com/lyceum-technology/pass.git
        pass git push -u origin main

   Note that this only possible for organization admins since it requires a
   direct push to the `main` branch of the pass repo.

## Adding Team Members to the Password Store

Adding a new GPG key requires re-encrypting all passwords which you can do as
follows:

```
cd ~/.password-store
pass init -p . <KEY-ID-1> <KEY-ID-2> ... <NEW-KEY-ID>
pass git push
```

## Fetching the Password Store

If you have already initialized as password store as described above, your team
members can initialize their local copies `git clone <PASS-REPO>
~/.password-store`. From there on, they can pull updates by simply running `pass
git pull`.
