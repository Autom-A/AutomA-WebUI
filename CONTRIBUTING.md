# Contributing to AutomA

We would love for you to contribute to AutomA and help make it even better!
As a contributor, here are the guidelines we would like you to follow, without it, building a community development environment would be impossible:

 - [Code of Conduct](#code-of-conduct)
 - [Question or Problem?](#assistance)
 - [Bugs](#bugs)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Coding Rules](#coding-rules)
 - [Commit Message Guidelines](#commit-conventions)

## <a name="code-of-conduct"></a> Code of Conduct

Ensure AutomA's openness and inclusivity by adhering to our [Code of Conduct][code-of-conduct-link].

## <a name="assistance"></a> Need assistance or facing an issue?

Please don't open issues in these cases, we want to keep issues for bugs, features and security issues.
However, you can turn to our [Discord][discord-server-link] server to discuss and ask any questions you may have. We will be pleased to help you.

## <a name="bugs"></a> Found a Bug?

Should you encounter a bug in the source code, we appreciate your support in improving our system. Feel free to contribute by [submitting an issue](#submit-issue) to our GitHub Repositories:
- [AutomA-WebUI](https://github.com/Autom-A/AutomA-WebUI)
- [AutomA-Playbooks](https://github.com/Autom-A/AutomA-Playbooks)
- [autom-a.github.io](https://github.com/Autom-A/autom-a.github.io)

For an even more proactive approach, consider [submitting a Pull Request](#submit-pull-request), providing a fix to the identified issue.

## <a name="feature"></a> Missing a Feature?

It is likely that we have not implemented all the features. Express your feature requests by [submitting an issue](#submit-issue) on our [GitHub Repositories][github-automa-link]. If you are eager to implement a new feature, consider the scope of the change for appropriate steps:

- For **Major Features**, initiate an issue outlining your proposal. This fosters discussion, coordination, and ensures seamless integration into the project.
  > *Note*: Addition of a new topic to the documentation or a substantial rewrite of an existing one is recognized as a major feature.

- For **Small Features**, you can create them directly and [submit them as Pull Requests](#submit-pull-request).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Prior to submitting an issue, it is advisable to search the issue tracker. This proactive step ensures that a similar issue may already be in existence, and the ongoing discussions could potentially provide insights or readily available workarounds for your problem.

Our goal is to promptly fix all issues, but prior to fixing a bug, we must reproduce and confirm it. To facilitate this process, we request a minimal reproduction from you. Providing a concise and reproducible scenario offers valuable information, eliminating the need for multiple follow-up questions and expediting the resolution process.

A minimal reproduction is instrumental in swiftly confirming a bug or identifying a coding issue. It serves to validate both the existence of the problem and the accuracy of our focus in addressing it.

Requesting a minimal reproduction is essential to optimize maintainers' time, enabling us to address more bugs efficiently. Developers often uncover coding problems while crafting these reproductions. While we acknowledge the challenge of extracting code snippets from larger bases, isolating the issue is crucial for effective resolution.

Regrettably, we cannot investigate or rectify bugs without a minimal reproduction. If there is no response, we may need to close an issue lacking sufficient information for reproduction.

You can create a new issue by selecting the corresponding template. 

### <a name="submit-pull-request"></a> Submitting a Pull Request (PR)

Prior to submitting your Pull Request, please take into consideration the following guidelines:

1. Before submitting your Pull Request, conduct a GitHub Repositories search for an open or closed PR related to your submission.
   Avoid duplicating existing efforts by ensuring your proposed changes are unique.

2. Ensure that there is an associated issue describing the problem you intend to fix or outlining the design for the feature you wish to add.
   Discussing the design in advance ensures alignment and readiness to accept your contribution.

3. If you are not a collaborator in the repository : fork the repository

4. In your repository, make your changes in a new git branch. 
   > *Note*: In case you are working in the main repository create your branch from the Github issue page to link them together

   ```shell
   # If you are in a forked repository
   git checkout -b my-fix-branch main
   # If you are in the main repository
   git checkout my-fix-branch
   ```

5. Create your patch, **including appropriate test cases**.

6. Follow our [Coding Rules](#coding-rules).

7. When committing changes, use a descriptive commit message following our [conventions](#commit-conventions).
   Adhering to these conventions is crucial, as release notes are automatically generated based on these messages.

8. In GitHub, send a pull request to `main` branch.

### Reviewing a Pull Request

The AutomA team retains the discretion to decline pull requests from community members who have not demonstrated good citizenship within the community. This encompasses failure to adhere to the [Code of Conduct][code-of-conduct-link] and applies to behavior both within and outside of AutomA-managed channels. The team can also refuse contributions that do not comply with the coding conditions below.

#### Addressing review feedback

If we ask for changes via code reviews then:

1. Make the required updates to the code.

2. Create a fixup commit and push to your GitHub repository (this will update your Pull Request):

    ```shell
    git commit --all --fixup HEAD
    git push
    ```

That is it! Thank you for your contribution!

##### Updating the commit message

Reviewers may frequently propose changes to a commit message, such as adding more context or aligning with our [commit message guidelines](#commit-conventions).
To update the commit message of the last commit on your branch:

1. Check out your branch:

    ```shell
    git checkout my-fix-branch
    ```

2. Amend the last commit and modify the commit message:

    ```shell
    git commit --amend
    ```

3. Push to your GitHub repository:

    ```shell
    git push --force-with-lease
    ```

> NOTE:
> If you need to update the commit message of an earlier commit, you can use `git rebase` in interactive mode.
> See the [git docs](https://git-scm.com/docs/git-rebase#_interactive_mode) for more details.


#### Your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes from the main branch (upstream for forked repository and origin for the main repository):

* Delete your branch

* Check out the main branch:
  ```shell
  git checkout main
  ```

* Delete your local branch:
  ```shell
  git branch -D my-fix-branch  
  ```

* Update your local `main`:
  ```shell
  # Forked repository
  git pull --ff upstream main
  # Main repository
  git pull
  ```

## <a name="coding-rules"></a> Coding Rules
Maintain consistency throughout the source code by keeping these rules in mind as you work:

* All features or bug fixes **must be tested**.
* All methods **must be documented**.

## <a name="commit-conventions"></a> Commit Message Format

*This specification is inspired from [Angular][angular-commit-message-format-link].*

We have very precise rules over how our Git commit messages must be formatted. This format leads to **easier to read commit history**.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-header) format.

The `body` is mandatory for all commits except for those of type "docs".
When the body is present it must be at least 20 characters long and must conform to the [Commit Message Body](#commit-body) format.

The `footer` is optional. The [Commit Message Footer](#commit-footer) format describes what the footer is used for and the structure it must have.


#### <a name="commit-header"></a>Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: backapi|frontapi|flask|ansible|materializecss|animation
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.


##### Type

Must be one of the following:

* **build**: Changes that affect the build system or external dependencies
* **ci**: Changes to our CI configuration files and scripts
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **test**: Adding missing tests or correcting existing tests

##### Scope
The scope should be the name of the field affected by your commit

The following is the list of supported scopes:

- `backapi`
- `frontapi`
- `flask`
- `ansible`
- `materializecss`
- `animation`

##### Summary

Use the summary field to provide a succinct description of the change:

* use the imperative, present tense: **"change"** not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

#### <a name="commit-body"></a>Commit Message Body

Just as in the summary, use the imperative, present tense: "fix" not "fixed" nor "fixes".

Explain the motivation for the change in the commit message body. This commit message should explain _why_ you are making the change.
You can include a comparison of the previous behavior with the new behavior in order to illustrate the impact of the change.


#### <a name="commit-footer"></a>Commit Message Footer

The footer can contain information about breaking changes and deprecations and is also the place to reference GitHub issues and other pull requests that this commit closes or is related to.
For example:

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixe #<issue number>
```

or

```
DEPRECATED: <what is deprecated>
<BLANK LINE>
<deprecation description + recommended update path>
<BLANK LINE>
<BLANK LINE>
Close #<pr number>
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

Similarly, a Deprecation section should start with "DEPRECATED: " followed by a short description of what is deprecated, a blank line, and a detailed description of the deprecation that also mentions the recommended update path.


### Revert commits

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.

The content of the commit message body should contain:

- information about the SHA of the commit being reverted in the following format: `This reverts commit <SHA>`,
- a clear description of the reason for reverting the commit message.


[code-of-conduct-link]: https://github.com/Autom-A/AutomA-WebUI/blob/main/CODE_OF_CONDUCT.md
[discord-server-link]: https://discord.gg/are6m8TdE7
[github-automa-link]: https://github.com/Autom-A/
[github-automa-webui-link]: https://github.com/Autom-A/AutomA-WebUI/
[github-automa-playbooks-link]: https://github.com/Autom-A/AutomA-Playbooks
[github-automa-wiki-link]: https://github.com/Autom-A/autom-a.github.io
[angular-commit-message-format-link]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format
