---
sidebar_position: 1
title: Git Branching Guide
description: A comprehensive guide to Git branching, switching branches, and working across multiple devices
---

# Git Branching Guide

Git branching is a powerful feature that allows you to work on different versions of your codebase simultaneously. This guide covers essential branching operations, with a focus on switching between branches, working with remote branches, and maintaining workflow consistency across multiple computers.

## Understanding Git Branches

A branch in Git is simply a lightweight movable pointer to a commit. The default branch in Git is called `main` (or `master` in older repositories). When you create a new branch, Git creates a new pointer to the same commit you're currently on.

```bash
# List all branches
git branch

# List all branches including remote branches
git branch -a
```

### Real-World Example: Feature Branch in [jirax](https://github.com/ivishalgandhi/jirax)

In the [jirax](https://github.com/ivishalgandhi/jirax) project, I used a feature branch to implement a significant enhancement: moving column names from hardcoded values in Python code to configurable settings in a TOML file.

Here's the branch structure:

```
* c3197ac (feature/column-names-in-config) Implement custom column ordering from TOML config file
* 4a80f8a Move column names to config.toml instead of hardcoding in .py file
* c5b7d53 (main) Remove debug output statements for cleaner console output
```

The feature branch `feature/column-names-in-config` was created to:

1. Move hardcoded column names from the Python file to the configuration file
2. Implement custom column ordering based on the configuration
3. Keep these changes isolated until they were fully tested

This branching strategy allowed me to:
- Continue working on the feature without affecting the stable main branch
- Make multiple commits to refine the implementation
- Test the changes thoroughly before merging
- Keep a clean commit history that clearly shows the purpose of each change

The branch modified two key files:
- `config.example.toml`: Added new configuration options for column names and ordering
- `jirax/jirax.py`: Updated the code to read column names from the config file instead of using hardcoded values

This is a perfect example of how feature branches enable parallel development streams, allowing you to work on new features without disrupting the main codebase.

## Creating and Switching Branches

### The Modern Way: `git switch`

Git introduced the `switch` command in version 2.23 to make branch operations more intuitive.

```bash
# Create and switch to a new branch
git switch -c new-feature

# Switch to an existing branch
git switch main
```

### The Traditional Way: `git checkout`

Before `git switch`, the `checkout` command was used for switching branches.

```bash
# Create and switch to a new branch
git checkout -b new-feature

# Switch to an existing branch
git checkout main
```

## Working with Remote Branches

Remote branches are references to the state of branches on your remote repositories.

### Fetching Remote Branches

```bash
# Fetch all branches from remote
git fetch origin

# Fetch a specific branch
git fetch origin feature-branch
```

### Checking Out Remote Branches

When you want to work on a branch that exists only on the remote:

```bash
# First, fetch all remote branches
git fetch origin

# Create a local branch that tracks the remote branch
git switch -c feature-branch origin/feature-branch

# Alternatively, using checkout
git checkout -b feature-branch origin/feature-branch

# Shorthand if the branch names match
git checkout --track origin/feature-branch
```

### Verifying Remote Branches

Before starting work, it's often good to verify which remote branches exist:

```bash
# List all remote branches
git branch -r

# Show details about a remote branch
git remote show origin
```

## Working Across Multiple Computers

When you work on different machines, keeping your Git workflow consistent is crucial.

### Best Practices for Multi-Device Git Workflow

1. **Always Pull Before Starting Work**

   ```bash
   git pull origin your-branch
   ```

2. **Push Regularly**

   ```bash
   git push origin your-branch
   ```

3. **Use Branch Tracking**

   Set up branch tracking to simplify push/pull operations:

   ```bash
   # Set upstream tracking
   git branch --set-upstream-to=origin/feature-branch feature-branch

   # After this, you can simply use:
   git pull
   git push
   ```

4. **Stash Changes When Switching Devices**

   If you need to switch computers before committing:

   ```bash
   # On computer 1: Save your work in progress
   git stash save "WIP: Feature description"
   git push origin your-branch

   # On computer 2: Get the latest changes and your stashed work
   git pull origin your-branch
   git stash list # Check if stash was pushed with the branch
   git stash apply # Apply the stashed changes
   ```

   Note: Git stashes are not automatically pushed to remote repositories. Consider using commits with clear "WIP" (Work In Progress) messages instead.

### Using Git Worktrees for Multiple Branches

If you're working on multiple branches simultaneously, Git worktrees can help:

```bash
# Create a new worktree for a branch
git worktree add ../project-feature-branch feature-branch

# Now you have two working directories, each on a different branch
```

## Resolving Branch Switching Issues

Sometimes you might encounter issues when trying to switch branches:

### Dealing with Uncommitted Changes

```bash
# If you have uncommitted changes that conflict with the branch you're switching to
git stash
git switch other-branch
git stash pop # When you switch back
```

### Checking for Unpushed Commits

Before switching computers, check if you have any unpushed commits:

```bash
# Show commits that haven't been pushed to the remote
git log origin/your-branch..your-branch
```

## Advanced Branch Management

### Cleaning Up Old Branches

```bash
# Delete a local branch
git branch -d old-branch

# Delete a remote branch
git push origin --delete old-branch

# Prune tracking branches that no longer exist on remote
git fetch --prune
```

### Renaming Branches

```bash
# Rename the current branch
git branch -m new-name

# Rename a specific branch
git branch -m old-name new-name
```

## Conclusion

Effective branch management is essential for a smooth Git workflow, especially when working across multiple devices. By following these practices, you can ensure your work remains consistent and synchronized regardless of which computer you're using.

Remember the key steps:
1. Fetch and pull before starting work
2. Push changes regularly
3. Set up proper branch tracking
4. Use stash or WIP commits when switching devices
5. Regularly clean up unused branches

These habits will help you maintain a clean and efficient Git workflow across all your development environments.
