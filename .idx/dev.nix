# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_22
  ];

  services.postgres = {
    enable = true;
    enableTcp = true;
  };

  # Sets environment variables in the workspace
  env = {
    DB_NAME = "postgres";
    DB_USER = "user";
    DB_HOST = "localhost";
    DB_PORT= "5432";
    DB_PASSWORD = "pass123";
    SERVER_PORT = "8080";
    JWT_ACCESS_TOKEN_SECRET = "access_secret";
    JWT_ACCESS_TOKEN_EXPIRATION_TIME = "86400";
    JWT_REFRESH_TOKEN_SECRET = "refresh_secret";
    JWT_REFRESH_TOKEN_EXPIRATION_TIME = "604800";
    JWT_VERIFICATION_TOKEN_SECRET = "veryfication_secret";
    JWT_VERIFICATION_TOKEN_EXPIRATION_TIME = "172800";
    EMAIL_SERVICE = "gmail";
    EMAIL_USER = "macquoidjohn@gmail.com";
    EMAIL_PASSWORD = "vymesheniy2017";
    EMAIL_CONFIRMATION_URL = "http://localhost:3000/api/users/email/confirm";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "mtxr.sqltools-driver-pg"
      "mtxr.sqltools"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        # web = {
        #   # Example: run "npm run dev" with PORT set to IDX's defined port for previews,
        #   # and show it in IDX's web preview panel
        #   command = ["npm" "run" "serve"];
        #   manager = "web";
        #   env = {
        #     # Environment variables to set for your server
        #     PORT = "$PORT";
        #   };
        # };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install JS dependencies from NPM
        # npm-install = "npm install";
        setup = ''
          initdb -D local
          psql --dbname=postgres -c "ALTER USER \"user\" PASSWORD 'pass123';"
          psql --dbname=postgres -c "CREATE DATABASE youtube;"
          psql --dbname=youtube -f create.sql
          psql --dbname=youtube -f example.sql
        '';
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Example: start a background task to watch and re-build backend code
        # watch-backend = "npm run watch-backend";
      };
    };
  };
}
