# Setup Poetry Action

A Github Action to install [Poetry](https://python-poetry.org) into a Python environment.

This is largely inspired-by/stolen-from [dschep/install-poetry-action](https://github.com/dschep/install-poetry-action)


# Usage

```yaml
steps:
  - uses: actions/setup-python@v2
  - uses: jayclassless/setup-poetry-action@v1
  - uses: actions/checkout@v2
  - run: poetry install
```


# Options

- `version`: The version of Poetry to install (defaults to the most recent).
- `preview`: Whether or not to install the preview version of Poetry (defaults to false).
- `create_virtualenvs`: Whether or not Poetry should create a new virtualenv when installing your project (defaults to false).

