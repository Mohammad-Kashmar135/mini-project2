# Additional Tasks for Nowar --- PR Fixes

## Goal

Fix the outstanding implementation and integration issues in the
`member-nowar` branch. **Do not add or run tests as part of this task.**

## Required Workflow

-   [ ] **1. Pull the latest changes from `main` before editing.**
    -   Fetch the latest remote branches.
    -   Update your local `main` branch from `origin/main`.
    -   Rebase `member-nowar` onto the latest `main`, or merge `main`
        into your branch according to the team's workflow.
    -   Resolve any conflicts carefully and keep unrelated changes out
        of this task.
-   [ ] **2. Fix the exception-filter filename.**
    -   Rename `api/src/common/all-exception.filter.ts` to
        `api/src/common/all-exceptions.filter.ts` (plural:
        `exceptions`).
    -   Update any imports that reference the old filename so they all
        use the same path.
    -   Keep the existing exception-handling behavior and required
        response messages unchanged.
-   [ ] **3. Export `PitchesService` from `PitchesModule`.**
    -   In `api/src/pitches/pitches.module.ts`, add `PitchesService` to
        the module's `exports` array.
    -   Ensure the module still registers `PitchesController` and
        `PitchesService` correctly.
-   [ ] **4. Align the seed-data path with the task specification.**
    -   The task specification references `api/src/data/seed.data.ts`,
        while the current service imports `api/src/data/data.ts`.
    -   Check the team's current seed-data convention and coordinate
        with the project lead before changing shared paths.
    -   Make the implementation and task/documentation agree. Avoid
        creating duplicate seed-data sources.
-   [ ] **5. Add the required API request examples.**
    -   Create `api/requests/api.http`.
    -   Include HTTP requests covering the endpoints required by section
        18 of `API.md`, including listing pitches and retrieving a pitch
        by ID.
    -   Use the correct local API base URL and include any relevant
        request examples required by the API specification.
    -   Do not add automated tests as part of this task.
-   [ ] **6. Remove generated TypeScript build metadata from the PR.**
    -   Remove `api/tsconfig.build.tsbuildinfo` from the changeset.
    -   Ensure generated `*.tsbuildinfo` files are ignored by Git if
        that is not already configured.
    -   Do not include unrelated generated files in the pull request.
-   [ ] **7. Review the final diff.**
    -   Confirm that only the intended implementation, request-example,
        and configuration changes are included.
    -   Check that imports use the corrected exception-filter filename.
    -   Check that `PitchesModule` exports `PitchesService`.
    -   Do not include test-writing or test-running work in this task.
-   [ ] **8. Commit and open a pull request.**
    -   Commit the fixes on `member-nowar`.
    -   Push the branch to GitHub.
    -   Open a pull request targeting `main`.
    -   In the PR description, summarize the fixes and mention that
        tests were intentionally excluded from this task.
    -   Link the original Nowar PR or task where appropriate.

## Acceptance Criteria

-   [ ] The exception-filter filename and all imports consistently use
    `all-exceptions.filter.ts`.
-   [ ] `PitchesModule` exports `PitchesService`.
-   [ ] The seed-data file path follows the agreed project convention
    and documentation.
-   [ ] `api/requests/api.http` contains the required API request
    examples.
-   [ ] `*.tsbuildinfo` build artifacts are not included in the PR.
-   [ ] A new pull request targeting `main` is open.
-   [ ] No tests were added or run as part of this task.
