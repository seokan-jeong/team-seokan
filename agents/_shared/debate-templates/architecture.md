# Architecture Debate Template

## Topic Structure
- **Category**: architecture
- **Typical Trigger**: When system design decisions impact scalability, maintainability, or team workflow

## Recommended Panel
| Agent | Role | Why |
|-------|------|-----|
| Hiroshi | Oracle | Deep technical analysis and pattern recognition |
| Nene | Planner | Long-term planning and phase breakdown expertise |
| Misae | Metis | Hidden requirements and edge case identification |

## Evaluation Criteria
| Criterion | Weight | Description |
|-----------|--------|-------------|
| Scalability | High | How well does the solution scale with growth? |
| Maintainability | High | How easy is it to maintain and modify over time? |
| Complexity | Medium | How complex is the implementation and operation? |
| Team Expertise | Medium | Does the team have experience with this approach? |
| Migration Cost | Medium | What is the cost to adopt or migrate to this solution? |
| Time to Market | Low | How quickly can this be delivered? |

## Standard Options Framework
### Option A: Monolithic Architecture
- **Pros**:
  - Simpler deployment and operations
  - Easier local development
  - Better performance for simple operations
  - Lower infrastructure cost initially
- **Cons**:
  - Harder to scale specific components
  - Tight coupling between modules
  - Longer build and deployment times as codebase grows
  - Single point of failure
- **Best when**:
  - Small to medium-sized teams
  - Early stage products
  - Unclear domain boundaries
  - Tight deadlines

### Option B: Microservices Architecture
- **Pros**:
  - Independent scaling of services
  - Technology flexibility per service
  - Isolated failures
  - Parallel team development
- **Cons**:
  - Increased operational complexity
  - Network latency overhead
  - Distributed system challenges (transactions, consistency)
  - Higher infrastructure cost
- **Best when**:
  - Clear domain boundaries exist
  - Need independent scaling
  - Large or distributed teams
  - Long-term product with evolving requirements

## Decision Factors Checklist
- [ ] What is the expected scale (users, data, traffic)?
- [ ] How many developers/teams will work on this?
- [ ] What are the deployment frequency requirements?
- [ ] What level of operational complexity can the team handle?
- [ ] Are there clear bounded contexts in the domain?
- [ ] What is the budget for infrastructure and operations?
- [ ] What is the timeline for initial delivery?
- [ ] What are the data consistency requirements?
- [ ] What is the acceptable level of system complexity?
- [ ] Does the team have microservices experience?

## Usage
Midori references this template when debate topic matches the category.
Panel should evaluate each option against the criteria and factors above.
