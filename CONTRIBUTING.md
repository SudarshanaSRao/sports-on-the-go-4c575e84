# Contributing to SquadUp

First off, thank you for considering contributing to SquadUp! It's people like you that make SquadUp such a great tool for the sports community.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be Respectful**: Treat everyone with respect. Harassment and abuse are never tolerated.
- **Be Collaborative**: Work together towards the common goal of improving SquadUp.
- **Be Patient**: Remember that everyone comes from different backgrounds and skill levels.
- **Be Constructive**: Provide helpful feedback and be open to receiving it.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear Title**: Use a descriptive title for the issue
- **Steps to Reproduce**: Detailed steps to reproduce the problem
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Screenshots**: If applicable, add screenshots
- **Environment**: Browser, OS, device type
- **Console Errors**: Any relevant console or network errors

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear title**: Describe the enhancement clearly
- **Detailed Description**: Explain why this enhancement would be useful
- **Use Cases**: Provide examples of how it would be used
- **Mockups**: If applicable, include mockups or wireframes

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

- **Good First Issue**: Issues labeled `good-first-issue` are great for newcomers
- **Help Wanted**: Issues labeled `help-wanted` need community assistance

### Pull Requests

1. **Fork the Repository**
   ```bash
   git fork https://github.com/yourusername/squadup
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-fix
   ```

3. **Make Your Changes**
   - Write clear, commented code
   - Follow the existing code style
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

## Development Setup

### Prerequisites
- Node.js (v18+)
- npm or bun
- Git

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/yourusername/squadup.git

# Navigate to directory
cd squadup

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Guidelines

#### Code Style
- Use TypeScript for type safety
- Follow the existing code structure
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names

#### Component Guidelines
- Place reusable components in `src/components/`
- Use Shadcn UI components when possible
- Follow the design system in `src/index.css`
- Ensure components are responsive
- Add proper TypeScript types

#### State Management
- Use React Query for server state
- Use React Context for global client state
- Keep component state local when possible
- Use custom hooks for reusable logic

#### Styling
- Use Tailwind CSS utility classes
- Follow the design tokens in `tailwind.config.ts`
- Use semantic color variables from `index.css`
- Ensure dark mode compatibility
- Make designs mobile-first

#### Database Changes
- Never modify `src/integrations/supabase/types.ts` directly
- Use database migrations for schema changes
- Always include RLS policies for new tables
- Test security policies thoroughly

#### Testing
- Test your changes manually
- Check responsive design on different screen sizes
- Test in both light and dark mode
- Verify accessibility features

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn components
│   └── ...             # Custom components
├── pages/              # Page components (routes)
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── integrations/       # Third-party integrations
└── main.tsx            # Entry point
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(games): add game filtering by distance
fix(auth): resolve login redirect issue
docs: update setup instructions
style(ui): improve button hover states
refactor(map): extract map logic to custom hook
```

## Pull Request Process

1. **Update Documentation**: Update the README.md with details of changes if needed
2. **Update Dependencies**: If you add dependencies, explain why they're needed
3. **Test Thoroughly**: Ensure all features work as expected
4. **Screenshots**: Add screenshots for UI changes
5. **Description**: Provide a clear description of the changes
6. **Link Issues**: Reference related issues in your PR description

## Review Process

- PRs require at least one approval from a maintainer
- Maintainers may request changes or provide feedback
- Be responsive to feedback and questions
- Once approved, a maintainer will merge your PR

## Community

- Join discussions in GitHub Discussions
- Share your ideas and feedback
- Help others in the community
- Spread the word about SquadUp!

## Questions?

Feel free to:
- Open an issue with the `question` label
- Start a discussion in GitHub Discussions
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SquadUp! 🎉
