[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)

# setup-cocoapods
This action sets up specific version of Cocoapods in GitHub Actions workflow.  
Action supports two ways to specify Cocoapods version:
- Specify particular version using `version` parameter
- Specify path to the `Podfile.lock` file using `podfile-path` parameter. In this case, version of Cocoapods [will be parsed from Podfile.lock](https://github.com/step-security/setup-cocoapods/blob/master/__tests__/podfile-example/Podfile.lock#L16).

Action is intended for macOS and Ubuntu platforms.

# Available parameters
| Parameter name     | Description                             | Supported format           |
|---------------|-----------------------------------------|----------------------------|
| version       | Specify version of Cocoapods to install | `latest`, `1.5.2`, `1.9.1` |
| podfile-path  | Specify path to `Podfile.lock` file to determine Cocoapods version dynamically | `myApp/Podfile.lock` |

At the same time, only one parameter should be specified.

# Usage
```
name: CI
on: [push]
jobs:
  build:
    name: Setup Cocoapods based on provided version
    runs-on: macos-latest
    steps:
    - name: setup-cocoapods
      uses: step-security/setup-cocoapods@v1
      with:
        version: 1.9.0

  build:
    name: Setup Cocoapods based on Podfile.lock
    runs-on: macos-latest
    steps:
    - name: setup-cocoapods
      uses: step-security/setup-cocoapods@v1
      with:
        podfile-path: myApp/Podfile.lock
```

# License
The scripts and documentation in this project are released under the [MIT License](LICENSE).
