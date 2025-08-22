# Testing & Deployment Strategy

## Testing Strategy Overview

### Testing Pyramid Approach
```
                    ┌─────────────────┐
                    │   E2E Tests     │ 10%
                    │   (Detox)       │
                ┌───┴─────────────────┴───┐
                │   Integration Tests     │ 20%
                │   (Jest + Supertest)    │
            ┌───┴─────────────────────────┴───┐
            │      Unit Tests                 │ 70%
            │   (Jest + React Testing)        │
            └─────────────────────────────────┘
```

## Unit Testing Strategy

### Frontend Testing (React Native)
**Framework**: Jest + React Native Testing Library
**Coverage Target**: 85% code coverage

#### Component Testing
```javascript
// Example: Transaction List Component Test
describe('TransactionList', () => {
  it('should render transactions correctly', () => {
    const mockTransactions = [
      { id: '1', amount: -23.45, description: 'Pizza Palace' },
      { id: '2', amount: 3200.00, description: 'Salary Deposit' }
    ];
    
    render(<TransactionList transactions={mockTransactions} />);
    
    expect(screen.getByText('Pizza Palace')).toBeInTheDocument();
    expect(screen.getByText('-$23.45')).toBeInTheDocument();
    expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
    expect(screen.getByText('+$3,200.00')).toBeInTheDocument();
  });

  it('should handle empty transaction list', () => {
    render(<TransactionList transactions={[]} />);
    expect(screen.getByText('No transactions found')).toBeInTheDocument();
  });
});
```

#### Redux Store Testing
```javascript
// Example: Budget Reducer Test
describe('budgetReducer', () => {
  it('should update budget when setBudgetLimit is called', () => {
    const initialState = { categories: [] };
    const action = setBudgetLimit({ categoryId: '1', limit: 500 });
    
    const newState = budgetReducer(initialState, action);
    
    expect(newState.categories[0].limit).toBe(500);
  });
});
```

### Backend Testing (Node.js)
**Framework**: Jest + Supertest
**Coverage Target**: 90% code coverage

#### API Endpoint Testing
```javascript
// Example: Transaction API Test
describe('POST /api/transactions', () => {
  it('should create a new transaction', async () => {
    const transactionData = {
      amount: -25.50,
      description: 'Coffee Shop',
      categoryId: 'food-dining',
      accountId: 'account-123'
    };

    const response = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${validToken}`)
      .send(transactionData)
      .expect(201);

    expect(response.body.transaction.amount).toBe(-25.50);
    expect(response.body.transaction.description).toBe('Coffee Shop');
  });

  it('should return 400 for invalid transaction data', async () => {
    const invalidData = { amount: 'invalid' };

    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${validToken}`)
      .send(invalidData)
      .expect(400);
  });
});
```

#### Service Layer Testing
```javascript
// Example: Budget Service Test
describe('BudgetService', () => {
  it('should calculate remaining budget correctly', () => {
    const budget = { limit: 500, spent: 350 };
    const remaining = BudgetService.calculateRemaining(budget);
    expect(remaining).toBe(150);
  });

  it('should detect budget overspending', () => {
    const budget = { limit: 500, spent: 600 };
    const isOverspent = BudgetService.isOverspent(budget);
    expect(isOverspent).toBe(true);
  });
});
```

## Integration Testing

### API Integration Tests
**Framework**: Jest + Supertest + Test Database
**Scope**: End-to-end API workflows

#### User Registration Flow
```javascript
describe('User Registration Integration', () => {
  it('should complete full registration flow', async () => {
    // 1. Register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      })
      .expect(201);

    // 2. Verify email token
    const verifyResponse = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: registerResponse.body.verificationToken })
      .expect(200);

    // 3. Login with credentials
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!'
      })
      .expect(200);

    expect(loginResponse.body.token).toBeDefined();
    expect(loginResponse.body.user.email).toBe('test@example.com');
  });
});
```

### Database Integration Tests
```javascript
describe('Transaction Database Integration', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  it('should persist transaction with correct relationships', async () => {
    const user = await createTestUser();
    const account = await createTestAccount(user.id);
    
    const transaction = await TransactionService.create({
      accountId: account.id,
      amount: -50.00,
      description: 'Test Transaction'
    });

    const retrieved = await TransactionService.findById(transaction.id);
    expect(retrieved.account.userId).toBe(user.id);
  });
});
```

## End-to-End Testing

### Mobile App E2E Testing
**Framework**: Detox (React Native)
**Scope**: Critical user journeys

#### Onboarding Flow Test
```javascript
describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should complete onboarding successfully', async () => {
    // Welcome screen
    await expect(element(by.text('Welcome to FinanceFlow'))).toBeVisible();
    await element(by.text('Get Started')).tap();

    // Account creation
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('SecurePass123!');
    await element(by.text('Create Account')).tap();

    // Bank connection
    await expect(element(by.text('Connect Your Bank'))).toBeVisible();
    await element(by.text('Connect with Plaid')).tap();
    
    // Mock bank selection in test environment
    await element(by.text('Test Bank')).tap();
    await element(by.id('username')).typeText('user_good');
    await element(by.id('password')).typeText('pass_good');
    await element(by.text('Submit')).tap();

    // Verify dashboard appears
    await expect(element(by.text('Dashboard'))).toBeVisible();
    await expect(element(by.text('Net Worth'))).toBeVisible();
  });
});
```

#### Budget Creation Test
```javascript
describe('Budget Management', () => {
  it('should create and track budget', async () => {
    await navigateToBudgets();
    
    // Create new budget
    await element(by.id('add-budget-button')).tap();
    await element(by.id('budget-name')).typeText('Monthly Budget');
    
    // Add categories
    await element(by.text('Food & Dining')).tap();
    await element(by.id('amount-input')).typeText('600');
    await element(by.text('Save')).tap();
    
    // Verify budget appears
    await expect(element(by.text('Monthly Budget'))).toBeVisible();
    await expect(element(by.text('$600'))).toBeVisible();
  });
});
```

## Performance Testing

### Load Testing
**Tool**: Artillery.js for API load testing
**Targets**: 
- 1000 concurrent users
- 95th percentile response time < 500ms
- 99.9% uptime

#### API Load Test Configuration
```yaml
# artillery-config.yml
config:
  target: 'https://api.financeflow.com'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 120
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "User authentication and data fetch"
    weight: 70
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.token"
              as: "authToken"
      - get:
          url: "/api/transactions"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - get:
          url: "/api/budgets"
          headers:
            Authorization: "Bearer {{ authToken }}"
```

### Mobile App Performance Testing
**Tools**: 
- Flipper for React Native debugging
- Xcode Instruments for iOS profiling
- Android Studio Profiler for Android

#### Performance Metrics
- **App Launch Time**: < 3 seconds cold start
- **Screen Transition**: < 300ms
- **Memory Usage**: < 150MB average
- **Battery Impact**: Minimal background usage
- **Network Efficiency**: Optimized API calls

## Security Testing

### Automated Security Scanning
**Tools**:
- **SAST**: SonarQube for static code analysis
- **DAST**: OWASP ZAP for dynamic testing
- **Dependency Scanning**: Snyk for vulnerability detection

#### Security Test Cases
```javascript
describe('Security Tests', () => {
  it('should prevent SQL injection attacks', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .get(`/api/transactions?search=${maliciousInput}`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(400);
      
    expect(response.body.error).toContain('Invalid input');
  });

  it('should require authentication for protected routes', async () => {
    await request(app)
      .get('/api/transactions')
      .expect(401);
  });

  it('should validate JWT tokens properly', async () => {
    const invalidToken = 'invalid.jwt.token';
    
    await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);
  });
});
```

### Penetration Testing
**Frequency**: Quarterly
**Scope**: 
- Authentication and authorization
- Data encryption and storage
- API security
- Mobile app security

## Deployment Strategy

### Environment Setup

#### Development Environment
- **Purpose**: Feature development and initial testing
- **Database**: Local PostgreSQL with test data
- **External APIs**: Sandbox/test environments
- **Deployment**: Manual deployment for testing

#### Staging Environment
- **Purpose**: Pre-production testing and QA
- **Database**: Staging PostgreSQL with production-like data
- **External APIs**: Sandbox environments
- **Deployment**: Automated via CI/CD pipeline

#### Production Environment
- **Purpose**: Live application serving real users
- **Database**: Production PostgreSQL with backups
- **External APIs**: Live production APIs
- **Deployment**: Blue-green deployment strategy

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Security scan
        run: npm audit
      
      - name: Code quality check
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: docker build -t financeflow:${{ github.sha }} .
      
      - name: Push to registry
        run: docker push financeflow:${{ github.sha }}

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: |
          kubectl set image deployment/api api=financeflow:${{ github.sha }}
          kubectl rollout status deployment/api

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Blue-green deployment
          kubectl apply -f k8s/production/
          kubectl set image deployment/api-green api=financeflow:${{ github.sha }}
          kubectl rollout status deployment/api-green
          # Switch traffic after successful deployment
          kubectl patch service api-service -p '{"spec":{"selector":{"version":"green"}}}'
```

### Mobile App Deployment

#### iOS App Store Deployment
1. **Code Signing**: Automatic signing with Xcode
2. **Build Process**: Automated via Fastlane
3. **TestFlight**: Beta testing distribution
4. **App Store Review**: Submission and review process
5. **Release**: Phased rollout (10% → 50% → 100%)

#### Google Play Store Deployment
1. **App Signing**: Google Play App Signing
2. **Build Process**: Automated via Fastlane
3. **Internal Testing**: Alpha track for QA
4. **Beta Testing**: Beta track for user testing
5. **Production**: Staged rollout with monitoring

#### Fastlane Configuration
```ruby
# fastlane/Fastfile
platform :ios do
  desc "Deploy to TestFlight"
  lane :beta do
    build_app(scheme: "FinanceFlow")
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end

  desc "Deploy to App Store"
  lane :release do
    build_app(scheme: "FinanceFlow")
    upload_to_app_store(
      force: true,
      reject_if_possible: true,
      skip_metadata: false,
      skip_screenshots: false,
      submit_for_review: true,
      automatic_release: false
    )
  end
end
```

### Database Migration Strategy

#### Migration Process
1. **Backup**: Automated database backup before migration
2. **Migration Scripts**: Version-controlled SQL scripts
3. **Rollback Plan**: Automated rollback capability
4. **Validation**: Post-migration data integrity checks

#### Example Migration Script
```sql
-- Migration: Add investment tracking tables
-- Version: 2024.01.15.001

BEGIN;

-- Create investment accounts table
CREATE TABLE investment_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    provider VARCHAR(100),
    balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create holdings table
CREATE TABLE holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investment_account_id UUID REFERENCES investment_accounts(id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    quantity DECIMAL(15,6) NOT NULL,
    average_cost DECIMAL(10,4),
    current_price DECIMAL(10,4),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_investment_accounts_user_id ON investment_accounts(user_id);
CREATE INDEX idx_holdings_account_id ON holdings(investment_account_id);
CREATE INDEX idx_holdings_symbol ON holdings(symbol);

-- Update version tracking
INSERT INTO schema_migrations (version, applied_at) 
VALUES ('2024.01.15.001', NOW());

COMMIT;
```

### Monitoring & Alerting

#### Application Monitoring
- **APM**: New Relic for application performance
- **Logs**: Centralized logging with ELK stack
- **Metrics**: Custom business metrics dashboard
- **Uptime**: Pingdom for availability monitoring

#### Alert Configuration
```yaml
# alerts.yml
alerts:
  - name: "High Error Rate"
    condition: "error_rate > 5%"
    duration: "5m"
    severity: "critical"
    notification: ["slack", "email", "pagerduty"]
  
  - name: "High Response Time"
    condition: "response_time_95th > 1000ms"
    duration: "10m"
    severity: "warning"
    notification: ["slack", "email"]
  
  - name: "Database Connection Issues"
    condition: "db_connection_errors > 10"
    duration: "2m"
    severity: "critical"
    notification: ["slack", "email", "pagerduty"]
```

### Rollback Strategy

#### Automated Rollback Triggers
- Error rate > 10% for 5 minutes
- Response time > 2 seconds for 10 minutes
- Database connection failures
- Critical security alerts

#### Rollback Process
1. **Immediate**: Stop new deployments
2. **Traffic**: Route traffic to previous version
3. **Database**: Rollback migrations if necessary
4. **Notification**: Alert team of rollback
5. **Investigation**: Root cause analysis
6. **Documentation**: Update incident log