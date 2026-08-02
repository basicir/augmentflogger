FlightLogger GraphQL API Reference

This is the official FlightLogger GraphQL API reference page. Here you will find documentation for all queries and mutations that can be invoked via the API, along with the structure of the data they return.

For an introduction to using the API, please visit the API section inside FlightLogger’s Help Center, which you can access through your FlightLogger account.

In the Help Center, you will also find a wide array of other useful resources, relevant to both the API and FlightLogger in general.

FlightLogger also hosts an official playground which can be used to interact with the API:

GraphQL Playground
Terms of Service

https://flightlogger.net/tac
API Endpoints

https://api.flightlogger.net/graphql

Headers

Authorization: Bearer <YOUR_API_TOKEN>

Queries
account
Description

Get the FlightLogger account scoped by an account-specific API key.
Response

Returns an Account
Example
Query

query Account {
  account {
    company
    country
    countryCode
    disabled
    logoUrl
    moneyLocale
    subdomain
  }
}

Response

{
  "data": {
    "account": {
      "company": "abc123",
      "country": "xyz789",
      "countryCode": "xyz789",
      "disabled": true,
      "logoUrl": "xyz789",
      "moneyLocale": "abc123",
      "subdomain": "abc123"
    }
  }
}

Queries
accountingTransactionTypes
Description

Valid transaction types for creating accounting transactions.
Response

Returns [AccountingTransactionType!]!
Example
Query

query AccountingTransactionTypes {
  accountingTransactionTypes {
    cents
    currency
    description
    id
  }
}

Response

{
  "data": {
    "accountingTransactionTypes": [
      {
        "cents": {},
        "currency": "abc123",
        "description": "xyz789",
        "id": Id
      }
    ]
  }
}

Queries
accountingTransactions
Description

Accounting transactions for the account or a specific user. Newest first.
Response

Returns an AccountingTransactionConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
userId - Id 	Filter by user. When omitted from root query, returns all account transactions.
Example
Query

query AccountingTransactions(
  $after: String,
  $before: String,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime,
  $userId: Id
) {
  accountingTransactions(
    after: $after,
    before: $before,
    first: $first,
    from: $from,
    last: $last,
    to: $to,
    userId: $userId
  ) {
    edges {
      cursor
      node {
        ...AccountingTransactionFragment
      }
    }
    nodes {
      audit {
        ...AuditInfoFragment
      }
      balanceCents
      balanceCurrency
      comment
      createdAt
      externalReference
      id
      priceCents
      priceCurrency
      transactionId
      transactionType
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "before": "abc123",
  "first": 987,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "to": "2007-12-03T10:15:30Z",
  "userId": Id
}

Response

{
  "data": {
    "accountingTransactions": {
      "edges": [AccountingTransactionEdge],
      "nodes": [AccountingTransaction],
      "pageInfo": PageInfo
    }
  }
}

Queries
aircraft
Description

Finds active aircraft.
Response

Returns an AircraftConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
callSigns - [String!] 	If provided, will only find aircraft whose callsign is included in the list.
first - Int 	Returns the first n elements from the list.
last - Int 	Returns the last n elements from the list.
Example
Query

query Aircraft(
  $after: String,
  $before: String,
  $callSigns: [String!],
  $first: Int,
  $last: Int
) {
  aircraft(
    after: $after,
    before: $before,
    callSigns: $callSigns,
    first: $first,
    last: $last
  ) {
    edges {
      cursor
      node {
        ...AircraftFragment
      }
    }
    nodes {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "before": "abc123",
  "callSigns": ["xyz789"],
  "first": 987,
  "last": 987
}

Response

{
  "data": {
    "aircraft": {
      "edges": [AircraftEdge],
      "nodes": [Aircraft],
      "pageInfo": PageInfo
    }
  }
}

Queries
bookings
Description

Find bookings in a timespan.
Response

Returns a BookingUnionConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
overlap - Boolean 	If true, includes bookings that overlap the requested time window instead of only bookings fully contained within it. Default = false
statuses - [BookingStatusEnum!] 	If provided, will only return bookings whose lifecycle status matches one in the list.
subtypes - [BookingSubtypeEnum!] 	If provided, will only return bookings that match one of the provided subtypes.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query Bookings(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $overlap: Boolean,
  $statuses: [BookingStatusEnum!],
  $subtypes: [BookingSubtypeEnum!],
  $to: DateTime
) {
  bookings(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    overlap: $overlap,
    statuses: $statuses,
    subtypes: $subtypes,
    to: $to
  ) {
    edges {
      cursor
      node {
        ... on ClassTheoryBooking {
          ...ClassTheoryBookingFragment
        }
        ... on ExamBooking {
          ...ExamBookingFragment
        }
        ... on ExtraTheoryBooking {
          ...ExtraTheoryBookingFragment
        }
        ... on MaintenanceBooking {
          ...MaintenanceBookingFragment
        }
        ... on MeetingBooking {
          ...MeetingBookingFragment
        }
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on OperationBooking {
          ...OperationBookingFragment
        }
        ... on ProgressTestBooking {
          ...ProgressTestBookingFragment
        }
        ... on RentalBooking {
          ...RentalBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
        ... on TheoryReleaseBooking {
          ...TheoryReleaseBookingFragment
        }
        ... on TypeQuestionnaireBooking {
          ...TypeQuestionnaireBookingFragment
        }
      }
    }
    nodes {
      ... on ClassTheoryBooking {
        ...ClassTheoryBookingFragment
      }
      ... on ExamBooking {
        ...ExamBookingFragment
      }
      ... on ExtraTheoryBooking {
        ...ExtraTheoryBookingFragment
      }
      ... on MaintenanceBooking {
        ...MaintenanceBookingFragment
      }
      ... on MeetingBooking {
        ...MeetingBookingFragment
      }
      ... on MultiStudentBooking {
        ...MultiStudentBookingFragment
      }
      ... on OperationBooking {
        ...OperationBookingFragment
      }
      ... on ProgressTestBooking {
        ...ProgressTestBookingFragment
      }
      ... on RentalBooking {
        ...RentalBookingFragment
      }
      ... on SingleStudentBooking {
        ...SingleStudentBookingFragment
      }
      ... on TheoryReleaseBooking {
        ...TheoryReleaseBookingFragment
      }
      ... on TypeQuestionnaireBooking {
        ...TypeQuestionnaireBookingFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "all": false,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 123,
  "from": "2007-12-03T10:15:30Z",
  "last": 123,
  "overlap": false,
  "statuses": ["CANCELLED"],
  "subtypes": ["CLASS_THEORY"],
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "bookings": {
      "edges": [BookingUnionEdge],
      "nodes": [ClassTheoryBooking],
      "pageInfo": PageInfo
    }
  }
}

Queries
classTheories
Description

Gets class theory registrations within a time-frame.
Response

Returns a ClassTheoryConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query ClassTheories(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  classTheories(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...ClassTheoryFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...ClassTheoryBookingFragment
      }
      class {
        ...ClassFragment
      }
      comment
      endsAt
      expensesInvoiceNumber
      groundTrainingSubject {
        ...SubjectCategoryFragment
      }
      id
      instructor {
        ...UserFragment
      }
      participations {
        ...TheoryParticipationFragment
      }
      startsAt
      subject
      subjectCategory {
        ...SubjectCategoryFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "all": true,
  "before": "abc123",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 987,
  "from": "2007-12-03T10:15:30Z",
  "last": 123,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "classTheories": {
      "edges": [ClassTheoryEdge],
      "nodes": [ClassTheory],
      "pageInfo": PageInfo
    }
  }
}

Queries
classes
Description

Gets classes (groups of students).
Response

Returns a ClassConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
last - Int 	Returns the last n elements from the list.
Example
Query

query Classes(
  $after: String,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $last: Int
) {
  classes(
    after: $after,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    last: $last
  ) {
    edges {
      cursor
      node {
        ...ClassFragment
      }
    }
    nodes {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 123,
  "last": 987
}

Response

{
  "data": {
    "classes": {
      "edges": [ClassEdge],
      "nodes": [Class],
      "pageInfo": PageInfo
    }
  }
}

Queries
classrooms
Description

Finds classrooms.
Response

Returns a ClassroomConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
first - Int 	Returns the first n elements from the list.
ids - [Id!] 	If provided, will only return classrooms with the given IDs.
includeDisabled - Boolean 	If true, will include disabled classrooms. Default = false
last - Int 	Returns the last n elements from the list.
Example
Query

query Classrooms(
  $after: String,
  $before: String,
  $first: Int,
  $ids: [Id!],
  $includeDisabled: Boolean,
  $last: Int
) {
  classrooms(
    after: $after,
    before: $before,
    first: $first,
    ids: $ids,
    includeDisabled: $includeDisabled,
    last: $last
  ) {
    edges {
      cursor
      node {
        ...ClassroomFragment
      }
    }
    nodes {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "before": "xyz789",
  "first": 987,
  "ids": [Id],
  "includeDisabled": false,
  "last": 123
}

Response

{
  "data": {
    "classrooms": {
      "edges": [ClassroomEdge],
      "nodes": [Classroom],
      "pageInfo": PageInfo
    }
  }
}

Queries
customer
Description

Find a customer by ID.
Response

Returns a Customer
Arguments
Name 	Description
id - String! 	
Example
Query

query Customer($id: String!) {
  customer(id: $id) {
    address
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    city
    company
    country
    email
    fullName
    id
    name
    phone
    reference
    zipCode
  }
}

Variables

{"id": "xyz789"}

Response

{
  "data": {
    "customer": {
      "address": "xyz789",
      "audit": AuditInfo,
      "city": "xyz789",
      "company": "xyz789",
      "country": "xyz789",
      "email": "abc123",
      "fullName": "xyz789",
      "id": "xyz789",
      "name": "xyz789",
      "phone": "abc123",
      "reference": "abc123",
      "zipCode": "xyz789"
    }
  }
}

Queries
customers
Description

Get customers on the current account.
Response

Returns a CustomerConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
company - String 	If provided, will only return customers whose company matches this value.
email - String 	If provided, will only return customers whose email matches this value.
first - Int 	Returns the first n elements from the list.
last - Int 	Returns the last n elements from the list.
reference - String 	If provided, will only return customers whose reference matches this value.
searchTerm - String 	If provided, will search company, full name, email, and reference.
Example
Query

query Customers(
  $after: String,
  $before: String,
  $changedAfter: DateTime,
  $company: String,
  $email: String,
  $first: Int,
  $last: Int,
  $reference: String,
  $searchTerm: String
) {
  customers(
    after: $after,
    before: $before,
    changedAfter: $changedAfter,
    company: $company,
    email: $email,
    first: $first,
    last: $last,
    reference: $reference,
    searchTerm: $searchTerm
  ) {
    edges {
      cursor
      node {
        ...CustomerFragment
      }
    }
    nodes {
      address
      audit {
        ...AuditInfoFragment
      }
      city
      company
      country
      email
      fullName
      id
      name
      phone
      reference
      zipCode
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "before": "abc123",
  "changedAfter": "2007-12-03T10:15:30Z",
  "company": "xyz789",
  "email": "abc123",
  "first": 123,
  "last": 123,
  "reference": "abc123",
  "searchTerm": "abc123"
}

Response

{
  "data": {
    "customers": {
      "edges": [CustomerEdge],
      "nodes": [Customer],
      "pageInfo": PageInfo
    }
  }
}

Queries
dutyTimes
Description

The duty times of the user, ordered by end time.
Response

Returns a DutyTimeConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query DutyTimes(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  dutyTimes(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...DutyTimeFragment
      }
    }
    nodes {
      audit {
        ...AuditInfoFragment
      }
      comment
      endsAt
      expensesInvoiceNumber
      id
      startsAt
      state
      user {
        ...UserFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "all": true,
  "before": "abc123",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 987,
  "from": "2007-12-03T10:15:30Z",
  "last": 123,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "dutyTimes": {
      "edges": [DutyTimeEdge],
      "nodes": [DutyTime],
      "pageInfo": PageInfo
    }
  }
}

Queries
exams
Response

Returns an ExamConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query Exams(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  exams(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...ExamFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...ExamBookingFragment
      }
      class {
        ...ClassFragment
      }
      endsAt
      examiner {
        ...UserFragment
      }
      expensesInvoiceNumber
      groundTrainingSubject {
        ...SubjectCategoryFragment
      }
      id
      participations {
        ...ExamParticipationFragment
      }
      startsAt
      subjectCategory {
        ...SubjectCategoryFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "all": true,
  "before": "abc123",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 123,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "exams": {
      "edges": [ExamEdge],
      "nodes": [Exam],
      "pageInfo": PageInfo
    }
  }
}

Queries
extraTheories
Description

Gets extra theory registrations within a time-frame.
Response

Returns an ExtraTheoryConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query ExtraTheories(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  extraTheories(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...ExtraTheoryFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...ExtraTheoryBookingFragment
      }
      description
      endsAt
      expensesInvoiceNumber
      id
      incomeInvoiceNumber
      instructor {
        ...UserFragment
      }
      startsAt
      user {
        ...UserFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": false,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 123,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "extraTheories": {
      "edges": [ExtraTheoryEdge],
      "nodes": [ExtraTheory],
      "pageInfo": PageInfo
    }
  }
}

Queries
fetchJob
Response

Returns a String
Arguments
Name 	Description
jobId - String! 	The ID of the job
Example
Query

query FetchJob($jobId: String!) {
  fetchJob(jobId: $jobId)
}

Variables

{"jobId": "xyz789"}

Response

{"data": {"fetchJob": "abc123"}}

Queries
flights
Description

Find flights in time-span.
Response

Returns a FlightConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query Flights(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  flights(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...FlightFragment
      }
    }
    nodes {
      accountingTransactions {
        ...AccountingTransactionFragment
      }
      activityRegistration {
        ...FlightRegistrationFragment
      }
      aircraft {
        ...AircraftFragment
      }
      arrivalAirport {
        ...AirportFragment
      }
      atSeconds
      audit {
        ...AuditInfoFragment
      }
      auprtSeconds
      calculatedFuelUsage
      crossCountrySeconds
      daySeconds
      departureAirport {
        ...AirportFragment
      }
      departureFuel
      departureFuelAdded
      departureOilAdded
      departureOilAddedTwo
      expensesInvoiceNumber
      flightType
      ftSeconds
      id
      ifSeconds
      ifrSeconds
      incomeInvoiceNumber
      landing
      landings {
        ...LandingFragment
      }
      localSeconds
      nightSeconds
      offBlock
      onBlock
      pilotFlyingSeconds
      pilotMonitoringSeconds
      primaryLog {
        ...FlightLogFragment
      }
      secondaryLog {
        ...FlightLogFragment
      }
      takeoff
      tertiaryLog {
        ...FlightLogFragment
      }
      timerFinishSeconds
      timerStartSeconds
      vfrSeconds
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": true,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 987,
  "from": "2007-12-03T10:15:30Z",
  "last": 123,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "flights": {
      "edges": [FlightEdge],
      "nodes": [Flight],
      "pageInfo": PageInfo
    }
  }
}

Queries
maintenanceParts
Description

A maintenance type.
Response

Returns a MaintenancePartConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
first - Int 	Returns the first n elements from the list.
last - Int 	Returns the last n elements from the list.
status - [MaintenancePartStatusEnum!] 	If provided, will only provide maintenance parts with a matching status.
Example
Query

query MaintenanceParts(
  $after: String,
  $before: String,
  $first: Int,
  $last: Int,
  $status: [MaintenancePartStatusEnum!]
) {
  maintenanceParts(
    after: $after,
    before: $before,
    first: $first,
    last: $last,
    status: $status
  ) {
    edges {
      cursor
      node {
        ...MaintenancePartFragment
      }
    }
    nodes {
      approvedAt
      approvedBy {
        ...UserFragment
      }
      audit {
        ...AuditInfoFragment
      }
      expirationCycles
      expirationDate
      expirationLogSeconds
      expiresOnLog
      id
      maintenanceType {
        ...MaintenanceFragment
      }
      name
      plane {
        ...AircraftFragment
      }
      rejectedAt
      rejectedBy {
        ...UserFragment
      }
      serialNumber
      status
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "before": "abc123",
  "first": 987,
  "last": 123,
  "status": ["APPROVED"]
}

Response

{
  "data": {
    "maintenanceParts": {
      "edges": [MaintenancePartEdge],
      "nodes": [MaintenancePart],
      "pageInfo": PageInfo
    }
  }
}

Queries
maintenanceTypes
Description

A maintenance part.
Response

Returns a MaintenanceConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
first - Int 	Returns the first n elements from the list.
last - Int 	Returns the last n elements from the list.
Example
Query

query MaintenanceTypes(
  $after: String,
  $before: String,
  $first: Int,
  $last: Int
) {
  maintenanceTypes(
    after: $after,
    before: $before,
    first: $first,
    last: $last
  ) {
    edges {
      cursor
      node {
        ...MaintenanceFragment
      }
    }
    nodes {
      audit {
        ...AuditInfoFragment
      }
      createdAt
      disabled
      expiresOnCycles
      expiresOnDate
      expiresOnLog
      name
      requireSerialNumber
      requireUploadOfDocument
      triggerOnLogTime
      updatedAt
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "before": "xyz789",
  "first": 987,
  "last": 987
}

Response

{
  "data": {
    "maintenanceTypes": {
      "edges": [MaintenanceEdge],
      "nodes": [Maintenance],
      "pageInfo": PageInfo
    }
  }
}

Queries
myFlightLogger
Description

Get my|FlightLogger data, subsequent queries gets data across all accounts.
Response

Returns a MyFlightLogger
Example
Query

query MyFlightLogger {
  myFlightLogger {
    avatarUrl
    callSign
    email
    firstName
    lastName
    logbookEntries {
      edges {
        ...LogbookEdgeFragment
      }
      nodes {
        ...LogbookFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    logbookSummations {
      coPilotSeconds
      daySeconds
      dualSeconds
      flightInstructorSeconds
      floatTimeSeconds
      ifTimeSeconds
      instructorSyntheticTrainingSeconds
      landingsDay
      landingsNight
      multiEngineIfrSeconds
      multiEngineVfrSeconds
      multiPilotSeconds
      nightSeconds
      pilotInCommandSeconds
      singleEngineIfrSeconds
      singleEngineVfrSeconds
      syntheticTrainingSeconds
      totalSeconds
    }
  }
}

Response

{
  "data": {
    "myFlightLogger": {
      "avatarUrl": "xyz789",
      "callSign": "xyz789",
      "email": "xyz789",
      "firstName": "abc123",
      "lastName": "abc123",
      "logbookEntries": LogbookConnection,
      "logbookSummations": LogbookSummation
    }
  }
}

Queries
operations
Response

Returns an OperationConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query Operations(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  operations(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...OperationFragment
      }
    }
    nodes {
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...OperationBookingFragment
      }
      comment
      crew {
        ...UserFragment
      }
      crossCountrySeconds
      customer {
        ...CustomerFragment
      }
      expensesInvoiceNumber
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      incomeInvoiceNumber
      instrumentSeconds
      multiSeconds
      nightSeconds
      operationType {
        ...OperationTypeFragment
      }
      pic {
        ...UserFragment
      }
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      totalSeconds
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": false,
  "before": "abc123",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 987,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "operations": {
      "edges": [OperationEdge],
      "nodes": [Operation],
      "pageInfo": PageInfo
    }
  }
}

Queries
presignedUploadUrls
Description

Gets presigned urls for uploading to cache
Response

Returns a PresignedUrls!
Arguments
Name 	Description
filename - String! 	
Example
Query

query PresignedUploadUrls($filename: String!) {
  presignedUploadUrls(filename: $filename) {
    signedGetUrl
    signedPutUrl
  }
}

Variables

{"filename": "xyz789"}

Response

{
  "data": {
    "presignedUploadUrls": {
      "signedGetUrl": "abc123",
      "signedPutUrl": "xyz789"
    }
  }
}

Queries
programs
Description

Finds active programs.
Response

Returns a ProgramConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
first - Int 	Returns the first n elements from the list.
last - Int 	Returns the last n elements from the list.
programIds - [Id!] 	If provided, will only return programs with the given IDs.
programName - String 	If provided, will only return programs with the name given.
programType - ProgramTypeEnum 	If provided, will only return programs of the type given.
Example
Query

query Programs(
  $after: String,
  $before: String,
  $first: Int,
  $last: Int,
  $programIds: [Id!],
  $programName: String,
  $programType: ProgramTypeEnum
) {
  programs(
    after: $after,
    before: $before,
    first: $first,
    last: $last,
    programIds: $programIds,
    programName: $programName,
    programType: $programType
  ) {
    edges {
      cursor
      node {
        ...ProgramFragment
      }
    }
    nodes {
      aircraftType
      audit {
        ...AuditInfoFragment
      }
      cbtaEnabled
      externalReference
      id
      name
      programRevisions {
        ...ProgramRevisionConnectionFragment
      }
      programType
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "before": "xyz789",
  "first": 123,
  "last": 123,
  "programIds": [Id],
  "programName": "abc123",
  "programType": "COMBINED_SYLLABUS"
}

Response

{
  "data": {
    "programs": {
      "edges": [ProgramEdge],
      "nodes": [Program],
      "pageInfo": PageInfo
    }
  }
}

Queries
progressTests
Description

Gets progress test registrations within a time-frame.
Response

Returns a ProgressTestConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query ProgressTests(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  progressTests(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...ProgressTestFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...ProgressTestBookingFragment
      }
      class {
        ...ClassFragment
      }
      comment
      endsAt
      expensesInvoiceNumber
      groundTrainingSubject {
        ...SubjectCategoryFragment
      }
      id
      instructor {
        ...UserFragment
      }
      note
      participations {
        ...TheoryParticipationFragment
      }
      startsAt
      subject
      subjectCategory {
        ...SubjectCategoryFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": false,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 123,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "progressTests": {
      "edges": [ProgressTestEdge],
      "nodes": [ProgressTest],
      "pageInfo": PageInfo
    }
  }
}

Queries
ptcClassTheories
Description

Gets class theory registrations within a time-frame.
Response

Returns a ClassTheoryConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query PtcClassTheories(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  ptcClassTheories(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...ClassTheoryFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...ClassTheoryBookingFragment
      }
      class {
        ...ClassFragment
      }
      comment
      endsAt
      expensesInvoiceNumber
      groundTrainingSubject {
        ...SubjectCategoryFragment
      }
      id
      instructor {
        ...UserFragment
      }
      participations {
        ...TheoryParticipationFragment
      }
      startsAt
      subject
      subjectCategory {
        ...SubjectCategoryFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": true,
  "before": "abc123",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 123,
  "from": "2007-12-03T10:15:30Z",
  "last": 123,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "ptcClassTheories": {
      "edges": [ClassTheoryEdge],
      "nodes": [ClassTheory],
      "pageInfo": PageInfo
    }
  }
}

Queries
ptcExams
Description

Gets exam registrations within a time-frame.
Response

Returns an ExamConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query PtcExams(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  ptcExams(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...ExamFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...ExamBookingFragment
      }
      class {
        ...ClassFragment
      }
      endsAt
      examiner {
        ...UserFragment
      }
      expensesInvoiceNumber
      groundTrainingSubject {
        ...SubjectCategoryFragment
      }
      id
      participations {
        ...ExamParticipationFragment
      }
      startsAt
      subjectCategory {
        ...SubjectCategoryFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": true,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 123,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "ptcExams": {
      "edges": [ExamEdge],
      "nodes": [Exam],
      "pageInfo": PageInfo
    }
  }
}

Queries
ptcProgressTests
Description

Gets progress test registrations within a time-frame.
Response

Returns a ProgressTestConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query PtcProgressTests(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  ptcProgressTests(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...ProgressTestFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...ProgressTestBookingFragment
      }
      class {
        ...ClassFragment
      }
      comment
      endsAt
      expensesInvoiceNumber
      groundTrainingSubject {
        ...SubjectCategoryFragment
      }
      id
      instructor {
        ...UserFragment
      }
      note
      participations {
        ...TheoryParticipationFragment
      }
      startsAt
      subject
      subjectCategory {
        ...SubjectCategoryFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": false,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 123,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "ptcProgressTests": {
      "edges": [ProgressTestEdge],
      "nodes": [ProgressTest],
      "pageInfo": PageInfo
    }
  }
}

Queries
ptcTheoryReleases
Description

Gets theory release registrations within a time-frame.
Response

Returns a TheoryReleaseConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query PtcTheoryReleases(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  ptcTheoryReleases(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...TheoryReleaseFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...TheoryReleaseBookingFragment
      }
      class {
        ...ClassFragment
      }
      comment
      endsAt
      expensesInvoiceNumber
      groundTrainingSubject {
        ...SubjectCategoryFragment
      }
      id
      instructor {
        ...UserFragment
      }
      note
      participations {
        ...TheoryParticipationFragment
      }
      startsAt
      subject
      subjectCategory {
        ...SubjectCategoryFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": false,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 123,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "ptcTheoryReleases": {
      "edges": [TheoryReleaseEdge],
      "nodes": [TheoryRelease],
      "pageInfo": PageInfo
    }
  }
}

Queries
ptcTypeQuestionnaires
Description

Gets type questionnaire registrations within a time-frame.
Response

Returns a TypeQuestionnaireConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query PtcTypeQuestionnaires(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  ptcTypeQuestionnaires(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...TypeQuestionnaireFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...TypeQuestionnaireBookingFragment
      }
      class {
        ...ClassFragment
      }
      comment
      endsAt
      expensesInvoiceNumber
      groundTrainingSubject {
        ...SubjectCategoryFragment
      }
      id
      instructor {
        ...UserFragment
      }
      note
      participations {
        ...TheoryParticipationFragment
      }
      startsAt
      subject
      subjectCategory {
        ...SubjectCategoryFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "all": true,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 987,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "ptcTypeQuestionnaires": {
      "edges": [TypeQuestionnaireEdge],
      "nodes": [TypeQuestionnaire],
      "pageInfo": PageInfo
    }
  }
}

Queries
rentals
Response

Returns a RentalConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query Rentals(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  rentals(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...RentalFragment
      }
    }
    nodes {
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...RentalBookingFragment
      }
      comment
      crossCountrySeconds
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instrumentSeconds
      multiSeconds
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      renter {
        ...UserFragment
      }
      singleSeconds
      totalSeconds
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": false,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 123,
  "from": "2007-12-03T10:15:30Z",
  "last": 123,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "rentals": {
      "edges": [RentalEdge],
      "nodes": [Rental],
      "pageInfo": PageInfo
    }
  }
}

Queries
subjectCategories
Description

Finds subject categories for the given program revision.
Response

Returns a SubjectCategoryConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
first - Int 	Returns the first n elements from the list.
last - Int 	Returns the last n elements from the list.
programRevisionId - Id! 	The program revision to return subject categories for.
Example
Query

query SubjectCategories(
  $after: String,
  $before: String,
  $first: Int,
  $last: Int,
  $programRevisionId: Id!
) {
  subjectCategories(
    after: $after,
    before: $before,
    first: $first,
    last: $last,
    programRevisionId: $programRevisionId
  ) {
    edges {
      cursor
      node {
        ...SubjectCategoryFragment
      }
    }
    nodes {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      theoryCourse {
        ...TheoryCourseFragment
      }
      totalSeconds
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "before": "xyz789",
  "first": 123,
  "last": 987,
  "programRevisionId": Id
}

Response

{
  "data": {
    "subjectCategories": {
      "edges": [SubjectCategoryEdge],
      "nodes": [SubjectCategory],
      "pageInfo": PageInfo
    }
  }
}

Queries
theoryLessonOptions
Description

Find eligible theory lesson options for theory-related booking creation and editing.
Response

Returns a TheoryLessonOptionConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
bookingType - TheoryLessonBookingSubtypeEnum! 	The theory-related booking subtype to resolve lesson options for.
first - Int 	Returns the first n elements from the list.
includeTheoryLessonId - Id 	Optionally include a specific lesson even if it would otherwise be filtered out.
last - Int 	Returns the last n elements from the list.
programRevisionId - Id! 	The program revision to resolve lessons within.
studentIds - [Id!]! 	The students the booking is being prepared for.
subjectCategoryId - Id! 	The subject category to resolve lessons for.
teamId - Id 	Optional team scope when resolving team-program lesson options.
Example
Query

query TheoryLessonOptions(
  $after: String,
  $before: String,
  $bookingType: TheoryLessonBookingSubtypeEnum!,
  $first: Int,
  $includeTheoryLessonId: Id,
  $last: Int,
  $programRevisionId: Id!,
  $studentIds: [Id!]!,
  $subjectCategoryId: Id!,
  $teamId: Id
) {
  theoryLessonOptions(
    after: $after,
    before: $before,
    bookingType: $bookingType,
    first: $first,
    includeTheoryLessonId: $includeTheoryLessonId,
    last: $last,
    programRevisionId: $programRevisionId,
    studentIds: $studentIds,
    subjectCategoryId: $subjectCategoryId,
    teamId: $teamId
  ) {
    edges {
      cursor
      node {
        ...TheoryLessonOptionFragment
      }
    }
    nodes {
      durationSeconds
      id
      name
      registeredStudentIds
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "before": "abc123",
  "bookingType": "CLASS_THEORY",
  "first": 987,
  "includeTheoryLessonId": Id,
  "last": 987,
  "programRevisionId": Id,
  "studentIds": [Id],
  "subjectCategoryId": Id,
  "teamId": Id
}

Response

{
  "data": {
    "theoryLessonOptions": {
      "edges": [TheoryLessonOptionEdge],
      "nodes": [TheoryLessonOption],
      "pageInfo": PageInfo
    }
  }
}

Queries
theoryLessonsForBooking
Use theoryLessonOptions instead.
Description

Returns eligible theory lesson options for theory-related booking creation and editing.
Response

Returns [TheoryLessonOption!]!
Arguments
Name 	Description
bookingType - BookingSubtypeEnum! 	The booking subtype to resolve lesson options for.
includeTheoryLessonId - Id 	Optionally include a specific lesson even if it would otherwise be filtered out.
programRevisionId - Id! 	The program revision to resolve lessons within.
studentIds - [Id!]! 	The students the booking is being prepared for.
subjectCategoryId - Id! 	The subject category to resolve lessons for.
teamId - Id 	Optional team scope when resolving team-program lesson options.
Example
Query

query TheoryLessonsForBooking(
  $bookingType: BookingSubtypeEnum!,
  $includeTheoryLessonId: Id,
  $programRevisionId: Id!,
  $studentIds: [Id!]!,
  $subjectCategoryId: Id!,
  $teamId: Id
) {
  theoryLessonsForBooking(
    bookingType: $bookingType,
    includeTheoryLessonId: $includeTheoryLessonId,
    programRevisionId: $programRevisionId,
    studentIds: $studentIds,
    subjectCategoryId: $subjectCategoryId,
    teamId: $teamId
  ) {
    durationSeconds
    id
    name
    registeredStudentIds
  }
}

Variables

{
  "bookingType": "CLASS_THEORY",
  "includeTheoryLessonId": Id,
  "programRevisionId": Id,
  "studentIds": [Id],
  "subjectCategoryId": Id,
  "teamId": Id
}

Response

{
  "data": {
    "theoryLessonsForBooking": [
      {
        "durationSeconds": 123,
        "id": Id,
        "name": "xyz789",
        "registeredStudentIds": [Id]
      }
    ]
  }
}

Queries
theoryReleases
Description

Gets theory release registrations within a time-frame.
Response

Returns a TheoryReleaseConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query TheoryReleases(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  theoryReleases(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...TheoryReleaseFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...TheoryReleaseBookingFragment
      }
      class {
        ...ClassFragment
      }
      comment
      endsAt
      expensesInvoiceNumber
      groundTrainingSubject {
        ...SubjectCategoryFragment
      }
      id
      instructor {
        ...UserFragment
      }
      note
      participations {
        ...TheoryParticipationFragment
      }
      startsAt
      subject
      subjectCategory {
        ...SubjectCategoryFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": true,
  "before": "abc123",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 987,
  "from": "2007-12-03T10:15:30Z",
  "last": 123,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "theoryReleases": {
      "edges": [TheoryReleaseEdge],
      "nodes": [TheoryRelease],
      "pageInfo": PageInfo
    }
  }
}

Queries
trainings
Description

training ( user lectures )
Response

Returns a TrainingConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
programIds - [Id!] 	If provided, will only return trainings for the program with the given ID.
status - [TrainingStatusEnum!] 	If provided, will only return when the status is set such as Passed, failed or Completed.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
userIds - [Id!] 	If provided, will only return trainings associated with user ID
Example
Query

query Trainings(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $programIds: [Id!],
  $status: [TrainingStatusEnum!],
  $to: DateTime,
  $userIds: [Id!]
) {
  trainings(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    programIds: $programIds,
    status: $status,
    to: $to,
    userIds: $userIds
  ) {
    edges {
      cursor
      node {
        ...TrainingFragment
      }
    }
    nodes {
      approvedByStudent
      approvedByStudentAt
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
      }
      briefingSeconds
      comment
      crossCountrySeconds
      debriefingSeconds
      failedPerformance
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instructor {
        ...UserFragment
      }
      instrumentSeconds
      lecture {
        ...LectureFragment
      }
      multiSeconds
      name
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      status
      student {
        ...UserFragment
      }
      submittedByInstructorAt
      totalSeconds
      userCategories {
        ...UserCategoryFragment
      }
      userProgram {
        ...UserProgramFragment
      }
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": true,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 987,
  "from": "2007-12-03T10:15:30Z",
  "last": 123,
  "programIds": [Id],
  "status": ["CREDITED"],
  "to": "2007-12-03T10:15:30Z",
  "userIds": [Id]
}

Response

{
  "data": {
    "trainings": {
      "edges": [TrainingEdge],
      "nodes": [Training],
      "pageInfo": PageInfo
    }
  }
}

Queries
typeQuestionnaires
Description

Gets type questionnaire registrations within a time-frame.
Response

Returns a TypeQuestionnaireConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example
Query

query TypeQuestionnaires(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime
) {
  typeQuestionnaires(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    to: $to
  ) {
    edges {
      cursor
      node {
        ...TypeQuestionnaireFragment
      }
    }
    nodes {
      attachments {
        ...AttachmentFragment
      }
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...TypeQuestionnaireBookingFragment
      }
      class {
        ...ClassFragment
      }
      comment
      endsAt
      expensesInvoiceNumber
      groundTrainingSubject {
        ...SubjectCategoryFragment
      }
      id
      instructor {
        ...UserFragment
      }
      note
      participations {
        ...TheoryParticipationFragment
      }
      startsAt
      subject
      subjectCategory {
        ...SubjectCategoryFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "all": false,
  "before": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 987,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "to": "2007-12-03T10:15:30Z"
}

Response

{
  "data": {
    "typeQuestionnaires": {
      "edges": [TypeQuestionnaireEdge],
      "nodes": [TypeQuestionnaire],
      "pageInfo": PageInfo
    }
  }
}

Queries
user
Description

Find a user by ID or the authenticated API key.
Response

Returns a User
Arguments
Name 	Description
id - String 	
Example
Query

query User($id: String) {
  user(id: $id) {
    accountingTransactions {
      edges {
        ...AccountingTransactionEdgeFragment
      }
      nodes {
        ...AccountingTransactionFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    availabilities {
      edges {
        ...UserAvailabilityEdgeFragment
      }
      nodes {
        ...UserAvailabilityFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    avatarUrl
    bookingTimeZone
    callSign
    contact {
      address
      city
      country
      dateOfBirth
      email
      gender
      phone
      zipcode
    }
    emergencyContact {
      address
      city
      country
      dateOfBirth
      email
      firstName
      lastName
      phone
      relation
      zipcode
    }
    firstName
    flightTimeZone
    flights {
      edges {
        ...FlightEdgeFragment
      }
      nodes {
        ...FlightFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    id
    lastName
    notes {
      adminNote
      instructorNote
      publicNote
    }
    overrideTimeZone
    references {
      caaRefNum
      reference
    }
    theoryTimeZone
    userPrograms {
      edges {
        ...UserProgramEdgeFragment
      }
      nodes {
        ...UserProgramFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
}

Variables

{"id": "abc123"}

Response

{
  "data": {
    "user": {
      "accountingTransactions": AccountingTransactionConnection,
      "audit": AuditInfo,
      "availabilities": UserAvailabilityConnection,
      "avatarUrl": "abc123",
      "bookingTimeZone": "abc123",
      "callSign": "abc123",
      "contact": UserContact,
      "emergencyContact": UserEmergencyContact,
      "firstName": "abc123",
      "flightTimeZone": "xyz789",
      "flights": FlightConnection,
      "id": "xyz789",
      "lastName": "xyz789",
      "notes": UserNotes,
      "overrideTimeZone": true,
      "references": UserReferences,
      "theoryTimeZone": "xyz789",
      "userPrograms": UserProgramConnection
    }
  }
}

Queries
userPrograms
Description

user_programs ( user programs )
Response

Returns a UserProgramConnection
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
all - Boolean 	If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String 	Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
programIds - [Id!] 	If provided, will only return trainings for the program with the given ID.
programType - ProgramTypeEnum 	If provided, will only return programs of the type given.
status - [UserProgramEnum!] 	If provided, will only return when the status is set such as Active, Standby or Completed.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
userIds - [Id!] 	If provided, will only return programs for the user with the given ID.
Example
Query

query UserPrograms(
  $after: String,
  $all: Boolean,
  $before: String,
  $changedAfter: DateTime,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $programIds: [Id!],
  $programType: ProgramTypeEnum,
  $status: [UserProgramEnum!],
  $to: DateTime,
  $userIds: [Id!]
) {
  userPrograms(
    after: $after,
    all: $all,
    before: $before,
    changedAfter: $changedAfter,
    first: $first,
    from: $from,
    last: $last,
    programIds: $programIds,
    programType: $programType,
    status: $status,
    to: $to,
    userIds: $userIds
  ) {
    edges {
      cursor
      node {
        ...UserProgramFragment
      }
    }
    nodes {
      assignmentDate
      audit {
        ...AuditInfoFragment
      }
      classTheory {
        ...TheoryParticipationFragment
      }
      exams {
        ...ExamParticipationFragment
      }
      id
      name
      program {
        ...ProgramFragment
      }
      programRevision {
        ...ProgramRevisionFragment
      }
      progressTests {
        ...TheoryParticipationFragment
      }
      status
      theoryReleases {
        ...TheoryParticipationFragment
      }
      trainings {
        ...TrainingConnectionFragment
      }
      typeQuestionnaires {
        ...TheoryParticipationFragment
      }
      user {
        ...UserFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "all": true,
  "before": "abc123",
  "changedAfter": "2007-12-03T10:15:30Z",
  "first": 987,
  "from": "2007-12-03T10:15:30Z",
  "last": 987,
  "programIds": [Id],
  "programType": "COMBINED_SYLLABUS",
  "status": ["ACTIVE"],
  "to": "2007-12-03T10:15:30Z",
  "userIds": [Id]
}

Response

{
  "data": {
    "userPrograms": {
      "edges": [UserProgramEdge],
      "nodes": [UserProgram],
      "pageInfo": PageInfo
    }
  }
}

Queries
users
Description

Get active users.
Response

Returns a UserConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
caaReferenceNumber - String 	If provided, will only return users whose CAA reference number matches this value.
callSign - String 	If provided, will only return users whose call sign matches this value.
changedAfter - DateTime 	If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
email - String 	If provided, will only return users whose email matches this value.
first - Int 	Returns the first n elements from the list.
last - Int 	Returns the last n elements from the list.
reference - String 	If provided, will only return users whose reference string matches this value.
roles - [UserRoleEnum!] 	If provided, will only return who has all roles in the collection.
searchTerm - String 	NOTE: Marked for imminent deprecation. Avoid using if at all possible.
Example
Query

query Users(
  $after: String,
  $before: String,
  $caaReferenceNumber: String,
  $callSign: String,
  $changedAfter: DateTime,
  $email: String,
  $first: Int,
  $last: Int,
  $reference: String,
  $roles: [UserRoleEnum!],
  $searchTerm: String
) {
  users(
    after: $after,
    before: $before,
    caaReferenceNumber: $caaReferenceNumber,
    callSign: $callSign,
    changedAfter: $changedAfter,
    email: $email,
    first: $first,
    last: $last,
    reference: $reference,
    roles: $roles,
    searchTerm: $searchTerm
  ) {
    edges {
      cursor
      node {
        ...UserFragment
      }
    }
    nodes {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "xyz789",
  "before": "abc123",
  "caaReferenceNumber": "xyz789",
  "callSign": "xyz789",
  "changedAfter": "2007-12-03T10:15:30Z",
  "email": "abc123",
  "first": 123,
  "last": 987,
  "reference": "abc123",
  "roles": ["ADMINISTRATOR"],
  "searchTerm": "xyz789"
}

Response

{
  "data": {
    "users": {
      "edges": [UserEdge],
      "nodes": [User],
      "pageInfo": PageInfo
    }
  }
}

Queries
versions
Description

Find changes done (versions) to entities in a timespan.
Response

Returns a VersionUnionConnection!
Arguments
Name 	Description
after - String 	Returns the elements in the list that come after the specified cursor.
before - String 	Returns the elements in the list that come before the specified cursor.
first - Int 	Returns the first n elements from the list.
from - DateTime 	If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int 	Returns the last n elements from the list.
to - DateTime 	If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
types - [VersionableEntityEnum!] 	The types of entities to search for.
Example
Query

query Versions(
  $after: String,
  $before: String,
  $first: Int,
  $from: DateTime,
  $last: Int,
  $to: DateTime,
  $types: [VersionableEntityEnum!]
) {
  versions(
    after: $after,
    before: $before,
    first: $first,
    from: $from,
    last: $last,
    to: $to,
    types: $types
  ) {
    edges {
      cursor
      node {
        ... on Deletion {
          ...DeletionFragment
        }
      }
    }
    nodes {
      ... on Deletion {
        ...DeletionFragment
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

Variables

{
  "after": "abc123",
  "before": "abc123",
  "first": 123,
  "from": "2007-12-03T10:15:30Z",
  "last": 123,
  "to": "2007-12-03T10:15:30Z",
  "types": ["BOOKING"]
}

Response

{
  "data": {
    "versions": {
      "edges": [VersionUnionEdge],
      "nodes": [Deletion],
      "pageInfo": PageInfo
    }
  }
}

Mutations
approveMaintenancePart
Description

Approve a maintenance part.
Response

Returns a MaintenancePart!
Arguments
Name 	Description
id - Id! 	
Example
Query

mutation ApproveMaintenancePart($id: Id!) {
  approveMaintenancePart(id: $id) {
    approvedAt
    approvedBy {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    expirationCycles
    expirationDate
    expirationLogSeconds
    expiresOnLog
    id
    maintenanceType {
      audit {
        ...AuditInfoFragment
      }
      createdAt
      disabled
      expiresOnCycles
      expiresOnDate
      expiresOnLog
      name
      requireSerialNumber
      requireUploadOfDocument
      triggerOnLogTime
      updatedAt
    }
    name
    plane {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    rejectedAt
    rejectedBy {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    serialNumber
    status
  }
}

Variables

{"id": Id}

Response

{
  "data": {
    "approveMaintenancePart": {
      "approvedAt": "2007-12-03T10:15:30Z",
      "approvedBy": User,
      "audit": AuditInfo,
      "expirationCycles": 987,
      "expirationDate": "2007-12-03T10:15:30Z",
      "expirationLogSeconds": 123,
      "expiresOnLog": "AIRBORNE",
      "id": Id,
      "maintenanceType": Maintenance,
      "name": "xyz789",
      "plane": Aircraft,
      "rejectedAt": "2007-12-03T10:15:30Z",
      "rejectedBy": User,
      "serialNumber": "xyz789",
      "status": "APPROVED"
    }
  }
}

Mutations
cancelBookings
Description

Bulk cancel bookings
Response

Returns a String!
Arguments
Name 	Description
bookingIds - [ID!]! 	
comment - String 	
reasonId - ID! 	
sendEmails - Boolean 	
Example
Query

mutation CancelBookings(
  $bookingIds: [ID!]!,
  $comment: String,
  $reasonId: ID!,
  $sendEmails: Boolean
) {
  cancelBookings(
    bookingIds: $bookingIds,
    comment: $comment,
    reasonId: $reasonId,
    sendEmails: $sendEmails
  )
}

Variables

{
  "bookingIds": [4],
  "comment": "abc123",
  "reasonId": 4,
  "sendEmails": true
}

Response

{"data": {"cancelBookings": "xyz789"}}

Mutations
createAccountingTransaction
Description

Create an accounting transaction for a user (e.g. record a payment from external system).
Response

Returns an AccountingTransaction!
Arguments
Name 	Description
activityDate - Date 	The date of the activity of the transaction.
amountCents - Int! 	Amount in cents. Positive = credit to user (payment received), negative = debit.
comment - String 	
externalReference - String 	External system reference for tracking.
transactionType - AccountTransactionTypeDescriptionInput! 	The type/category of the transaction. Must provide either a valid transactionTypeId or a freeText description.
userId - Id! 	The user to create the transaction for.
Example
Query

mutation CreateAccountingTransaction(
  $activityDate: Date,
  $amountCents: Int!,
  $comment: String,
  $externalReference: String,
  $transactionType: AccountTransactionTypeDescriptionInput!,
  $userId: Id!
) {
  createAccountingTransaction(
    activityDate: $activityDate,
    amountCents: $amountCents,
    comment: $comment,
    externalReference: $externalReference,
    transactionType: $transactionType,
    userId: $userId
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    balanceCents
    balanceCurrency
    comment
    createdAt
    externalReference
    id
    priceCents
    priceCurrency
    transactionId
    transactionType
  }
}

Variables

{
  "activityDate": "2007-12-03",
  "amountCents": 987,
  "comment": "xyz789",
  "externalReference": "abc123",
  "transactionType": AccountTransactionTypeDescriptionInput,
  "userId": Id
}

Response

{
  "data": {
    "createAccountingTransaction": {
      "audit": AuditInfo,
      "balanceCents": {},
      "balanceCurrency": "xyz789",
      "comment": "xyz789",
      "createdAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "id": Id,
      "priceCents": {},
      "priceCurrency": "xyz789",
      "transactionId": 987,
      "transactionType": "abc123"
    }
  }
}

Mutations
createClassTheoryBooking
Description

Creates a class theory booking
Response

Returns a ClassTheoryBooking!
Arguments
Name 	Description
booking - ClassTheoryBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateClassTheoryBooking(
  $booking: ClassTheoryBookingInput!,
  $skipWarnings: Boolean
) {
  createClassTheoryBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    class {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    subject
    theoryCourse {
      audit {
        ...AuditInfoFragment
      }
      disabled
      id
      name
    }
  }
}

Variables

{
  "booking": ClassTheoryBookingInput,
  "skipWarnings": false
}

Response

{
  "data": {
    "createClassTheoryBooking": {
      "audit": AuditInfo,
      "class": Class,
      "classroom": Classroom,
      "color": "abc123",
      "comment": "abc123",
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "id": "abc123",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User],
      "subject": "abc123",
      "theoryCourse": TheoryCourse
    }
  }
}

Mutations
createCustomer
Description

Create a customer on the current account.
Response

Returns a Customer!
Arguments
Name 	Description
customer - CustomerInput! 	
Example
Query

mutation CreateCustomer($customer: CustomerInput!) {
  createCustomer(customer: $customer) {
    address
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    city
    company
    country
    email
    fullName
    id
    name
    phone
    reference
    zipCode
  }
}

Variables

{"customer": CustomerInput}

Response

{
  "data": {
    "createCustomer": {
      "address": "xyz789",
      "audit": AuditInfo,
      "city": "xyz789",
      "company": "abc123",
      "country": "xyz789",
      "email": "xyz789",
      "fullName": "xyz789",
      "id": "xyz789",
      "name": "xyz789",
      "phone": "abc123",
      "reference": "abc123",
      "zipCode": "abc123"
    }
  }
}

Mutations
createExamBooking
Description

Creates an exam booking
Response

Returns an ExamBooking!
Arguments
Name 	Description
booking - ExamBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateExamBooking(
  $booking: ExamBookingInput!,
  $skipWarnings: Boolean
) {
  createExamBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    class {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    subject
    theoryCourse {
      audit {
        ...AuditInfoFragment
      }
      disabled
      id
      name
    }
  }
}

Variables

{"booking": ExamBookingInput, "skipWarnings": false}

Response

{
  "data": {
    "createExamBooking": {
      "audit": AuditInfo,
      "class": Class,
      "classroom": Classroom,
      "color": "xyz789",
      "comment": "xyz789",
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "id": "abc123",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User],
      "subject": "xyz789",
      "theoryCourse": TheoryCourse
    }
  }
}

Mutations
createExtraTheoryBooking
Description

Creates an extra theory booking
Response

Returns an ExtraTheoryBooking!
Arguments
Name 	Description
booking - ExtraTheoryBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateExtraTheoryBooking(
  $booking: ExtraTheoryBookingInput!,
  $skipWarnings: Boolean
) {
  createExtraTheoryBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    student {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
  }
}

Variables

{"booking": ExtraTheoryBookingInput, "skipWarnings": true}

Response

{
  "data": {
    "createExtraTheoryBooking": {
      "audit": AuditInfo,
      "classroom": Classroom,
      "color": "xyz789",
      "comment": "xyz789",
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "id": "abc123",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "student": User
    }
  }
}

Mutations
createMaintenanceBooking
Description

Create a maintenance booking.
Response

Returns a MaintenanceBooking!
Arguments
Name 	Description
booking - MaintenanceBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateMaintenanceBooking(
  $booking: MaintenanceBookingInput!,
  $skipWarnings: Boolean
) {
  createMaintenanceBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    aircraft {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    arrivalAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    color
    comment
    departureAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    emailNotifications
    endsAt
    externalReference
    flightEndsAt
    flightStartsAt
    id
    startsAt
    status
  }
}

Variables

{
  "booking": MaintenanceBookingInput,
  "skipWarnings": false
}

Response

{
  "data": {
    "createMaintenanceBooking": {
      "aircraft": Aircraft,
      "arrivalAirport": Airport,
      "audit": AuditInfo,
      "color": "abc123",
      "comment": "xyz789",
      "departureAirport": Airport,
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "flightEndsAt": "2007-12-03T10:15:30Z",
      "flightStartsAt": "2007-12-03T10:15:30Z",
      "id": "abc123",
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED"
    }
  }
}

Mutations
createMaintenancePart
Description

Create a maintenance part pending approval for an aircraft.
Response

Returns a MaintenancePart!
Arguments
Name 	Description
aircraftId - Id! 	
maintenancePart - MaintenancePartInput 	Default = {}
maintenanceRequirementId - Id! 	
Example
Query

mutation CreateMaintenancePart(
  $aircraftId: Id!,
  $maintenancePart: MaintenancePartInput,
  $maintenanceRequirementId: Id!
) {
  createMaintenancePart(
    aircraftId: $aircraftId,
    maintenancePart: $maintenancePart,
    maintenanceRequirementId: $maintenanceRequirementId
  ) {
    approvedAt
    approvedBy {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    expirationCycles
    expirationDate
    expirationLogSeconds
    expiresOnLog
    id
    maintenanceType {
      audit {
        ...AuditInfoFragment
      }
      createdAt
      disabled
      expiresOnCycles
      expiresOnDate
      expiresOnLog
      name
      requireSerialNumber
      requireUploadOfDocument
      triggerOnLogTime
      updatedAt
    }
    name
    plane {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    rejectedAt
    rejectedBy {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    serialNumber
    status
  }
}

Variables

{
  "aircraftId": Id,
  "maintenancePart": {},
  "maintenanceRequirementId": Id
}

Response

{
  "data": {
    "createMaintenancePart": {
      "approvedAt": "2007-12-03T10:15:30Z",
      "approvedBy": User,
      "audit": AuditInfo,
      "expirationCycles": 123,
      "expirationDate": "2007-12-03T10:15:30Z",
      "expirationLogSeconds": 987,
      "expiresOnLog": "AIRBORNE",
      "id": Id,
      "maintenanceType": Maintenance,
      "name": "xyz789",
      "plane": Aircraft,
      "rejectedAt": "2007-12-03T10:15:30Z",
      "rejectedBy": User,
      "serialNumber": "xyz789",
      "status": "APPROVED"
    }
  }
}

Mutations
createMeetingBooking
Description

Create a meeting booking.
Response

Returns a MeetingBooking!
Arguments
Name 	Description
booking - MeetingBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateMeetingBooking(
  $booking: MeetingBookingInput!,
  $skipWarnings: Boolean
) {
  createMeetingBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    participants {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
  }
}

Variables

{"booking": MeetingBookingInput, "skipWarnings": true}

Response

{
  "data": {
    "createMeetingBooking": {
      "audit": AuditInfo,
      "classroom": Classroom,
      "color": "abc123",
      "comment": "xyz789",
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "id": "abc123",
      "participants": [User],
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED"
    }
  }
}

Mutations
createMultiStudentBooking
Description

Creates a multi student booking
Response

Returns a MultiStudentBooking!
Arguments
Name 	Description
booking - MultiStudentBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateMultiStudentBooking(
  $booking: MultiStudentBookingInput!,
  $skipWarnings: Boolean
) {
  createMultiStudentBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    aircraft {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    arrivalAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    cancellations {
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on ClassTheoryBooking {
          ...ClassTheoryBookingFragment
        }
        ... on ExamBooking {
          ...ExamBookingFragment
        }
        ... on ExtraTheoryBooking {
          ...ExtraTheoryBookingFragment
        }
        ... on MaintenanceBooking {
          ...MaintenanceBookingFragment
        }
        ... on MeetingBooking {
          ...MeetingBookingFragment
        }
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on OperationBooking {
          ...OperationBookingFragment
        }
        ... on ProgressTestBooking {
          ...ProgressTestBookingFragment
        }
        ... on RentalBooking {
          ...RentalBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
        ... on TheoryReleaseBooking {
          ...TheoryReleaseBookingFragment
        }
        ... on TypeQuestionnaireBooking {
          ...TypeQuestionnaireBookingFragment
        }
      }
      comment
      id
      title
      user {
        ...UserFragment
      }
    }
    color
    comment
    departureAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    emailNotifications
    endsAt
    externalReference
    flightEndsAt
    flightStartsAt
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    observers {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    plannedLessons {
      approvedByStudent
      approvedByStudentAt
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
      }
      briefingSeconds
      comment
      crossCountrySeconds
      debriefingSeconds
      failedPerformance
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instructor {
        ...UserFragment
      }
      instrumentSeconds
      lecture {
        ...LectureFragment
      }
      multiSeconds
      name
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      status
      student {
        ...UserFragment
      }
      submittedByInstructorAt
      totalSeconds
      userCategories {
        ...UserCategoryFragment
      }
      userProgram {
        ...UserProgramFragment
      }
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    registrations {
      approvedByStudent
      approvedByStudentAt
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
      }
      briefingSeconds
      comment
      crossCountrySeconds
      debriefingSeconds
      failedPerformance
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instructor {
        ...UserFragment
      }
      instrumentSeconds
      lecture {
        ...LectureFragment
      }
      multiSeconds
      name
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      status
      student {
        ...UserFragment
      }
      submittedByInstructorAt
      totalSeconds
      userCategories {
        ...UserCategoryFragment
      }
      userProgram {
        ...UserProgramFragment
      }
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
  }
}

Variables

{
  "booking": MultiStudentBookingInput,
  "skipWarnings": false
}

Response

{
  "data": {
    "createMultiStudentBooking": {
      "aircraft": Aircraft,
      "arrivalAirport": Airport,
      "audit": AuditInfo,
      "cancellations": [BookingCancellation],
      "color": "xyz789",
      "comment": "abc123",
      "departureAirport": Airport,
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "flightEndsAt": "2007-12-03T10:15:30Z",
      "flightStartsAt": "2007-12-03T10:15:30Z",
      "id": "abc123",
      "instructor": User,
      "observers": [User],
      "plannedLessons": [Training],
      "registrations": [Training],
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User]
    }
  }
}

Mutations
createOperationBooking
Description

Creates an operation booking
Response

Returns an OperationBooking!
Arguments
Name 	Description
booking - OperationBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateOperationBooking(
  $booking: OperationBookingInput!,
  $skipWarnings: Boolean
) {
  createOperationBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    aircraft {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    arrivalAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    cancellation {
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on ClassTheoryBooking {
          ...ClassTheoryBookingFragment
        }
        ... on ExamBooking {
          ...ExamBookingFragment
        }
        ... on ExtraTheoryBooking {
          ...ExtraTheoryBookingFragment
        }
        ... on MaintenanceBooking {
          ...MaintenanceBookingFragment
        }
        ... on MeetingBooking {
          ...MeetingBookingFragment
        }
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on OperationBooking {
          ...OperationBookingFragment
        }
        ... on ProgressTestBooking {
          ...ProgressTestBookingFragment
        }
        ... on RentalBooking {
          ...RentalBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
        ... on TheoryReleaseBooking {
          ...TheoryReleaseBookingFragment
        }
        ... on TypeQuestionnaireBooking {
          ...TypeQuestionnaireBookingFragment
        }
      }
      comment
      id
      title
      user {
        ...UserFragment
      }
    }
    color
    comment
    crew {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    customer {
      address
      audit {
        ...AuditInfoFragment
      }
      city
      company
      country
      email
      fullName
      id
      name
      phone
      reference
      zipCode
    }
    departureAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    emailNotifications
    endsAt
    externalReference
    flightEndsAt
    flightStartsAt
    id
    operationType {
      audit {
        ...AuditInfoFragment
      }
      externalReference
      id
      name
      note
    }
    pic {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    registration {
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...OperationBookingFragment
      }
      comment
      crew {
        ...UserFragment
      }
      crossCountrySeconds
      customer {
        ...CustomerFragment
      }
      expensesInvoiceNumber
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      incomeInvoiceNumber
      instrumentSeconds
      multiSeconds
      nightSeconds
      operationType {
        ...OperationTypeFragment
      }
      pic {
        ...UserFragment
      }
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      totalSeconds
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    startsAt
    status
  }
}

Variables

{"booking": OperationBookingInput, "skipWarnings": true}

Response

{
  "data": {
    "createOperationBooking": {
      "aircraft": Aircraft,
      "arrivalAirport": Airport,
      "audit": AuditInfo,
      "cancellation": BookingCancellation,
      "color": "xyz789",
      "comment": "abc123",
      "crew": [User],
      "customer": Customer,
      "departureAirport": Airport,
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "flightEndsAt": "2007-12-03T10:15:30Z",
      "flightStartsAt": "2007-12-03T10:15:30Z",
      "id": "xyz789",
      "operationType": OperationType,
      "pic": User,
      "registration": Operation,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED"
    }
  }
}

Mutations
createProgressTestBooking
Description

Creates a progress test booking
Response

Returns a ProgressTestBooking!
Arguments
Name 	Description
booking - ProgressTestBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateProgressTestBooking(
  $booking: ProgressTestBookingInput!,
  $skipWarnings: Boolean
) {
  createProgressTestBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    class {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    subject
    theoryCourse {
      audit {
        ...AuditInfoFragment
      }
      disabled
      id
      name
    }
  }
}

Variables

{
  "booking": ProgressTestBookingInput,
  "skipWarnings": true
}

Response

{
  "data": {
    "createProgressTestBooking": {
      "audit": AuditInfo,
      "class": Class,
      "classroom": Classroom,
      "color": "xyz789",
      "comment": "xyz789",
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "id": "xyz789",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User],
      "subject": "xyz789",
      "theoryCourse": TheoryCourse
    }
  }
}

Mutations
createRentalBooking
Description

Creates a rental booking
Response

Returns a RentalBooking!
Arguments
Name 	Description
booking - RentalBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateRentalBooking(
  $booking: RentalBookingInput!,
  $skipWarnings: Boolean
) {
  createRentalBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    aircraft {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    approved
    arrivalAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    cancellation {
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on ClassTheoryBooking {
          ...ClassTheoryBookingFragment
        }
        ... on ExamBooking {
          ...ExamBookingFragment
        }
        ... on ExtraTheoryBooking {
          ...ExtraTheoryBookingFragment
        }
        ... on MaintenanceBooking {
          ...MaintenanceBookingFragment
        }
        ... on MeetingBooking {
          ...MeetingBookingFragment
        }
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on OperationBooking {
          ...OperationBookingFragment
        }
        ... on ProgressTestBooking {
          ...ProgressTestBookingFragment
        }
        ... on RentalBooking {
          ...RentalBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
        ... on TheoryReleaseBooking {
          ...TheoryReleaseBookingFragment
        }
        ... on TypeQuestionnaireBooking {
          ...TypeQuestionnaireBookingFragment
        }
      }
      comment
      id
      title
      user {
        ...UserFragment
      }
    }
    color
    comment
    departureAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    emailNotifications
    endsAt
    externalReference
    flightEndsAt
    flightStartsAt
    id
    registration {
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...RentalBookingFragment
      }
      comment
      crossCountrySeconds
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instrumentSeconds
      multiSeconds
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      renter {
        ...UserFragment
      }
      singleSeconds
      totalSeconds
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    renter {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
  }
}

Variables

{"booking": RentalBookingInput, "skipWarnings": false}

Response

{
  "data": {
    "createRentalBooking": {
      "aircraft": Aircraft,
      "approved": false,
      "arrivalAirport": Airport,
      "audit": AuditInfo,
      "cancellation": BookingCancellation,
      "color": "xyz789",
      "comment": "abc123",
      "departureAirport": Airport,
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "flightEndsAt": "2007-12-03T10:15:30Z",
      "flightStartsAt": "2007-12-03T10:15:30Z",
      "id": "abc123",
      "registration": Rental,
      "renter": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED"
    }
  }
}

Mutations
createSingleStudentBooking
Description

Creates a single student booking
Response

Returns a SingleStudentBooking!
Arguments
Name 	Description
booking - SingleStudentBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateSingleStudentBooking(
  $booking: SingleStudentBookingInput!,
  $skipWarnings: Boolean
) {
  createSingleStudentBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    aircraft {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    arrivalAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    cancellation {
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on ClassTheoryBooking {
          ...ClassTheoryBookingFragment
        }
        ... on ExamBooking {
          ...ExamBookingFragment
        }
        ... on ExtraTheoryBooking {
          ...ExtraTheoryBookingFragment
        }
        ... on MaintenanceBooking {
          ...MaintenanceBookingFragment
        }
        ... on MeetingBooking {
          ...MeetingBookingFragment
        }
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on OperationBooking {
          ...OperationBookingFragment
        }
        ... on ProgressTestBooking {
          ...ProgressTestBookingFragment
        }
        ... on RentalBooking {
          ...RentalBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
        ... on TheoryReleaseBooking {
          ...TheoryReleaseBookingFragment
        }
        ... on TypeQuestionnaireBooking {
          ...TypeQuestionnaireBookingFragment
        }
      }
      comment
      id
      title
      user {
        ...UserFragment
      }
    }
    color
    comment
    departureAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    emailNotifications
    endsAt
    externalReference
    flightEndsAt
    flightStartsAt
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    observers {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    plannedLesson {
      approvedByStudent
      approvedByStudentAt
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
      }
      briefingSeconds
      comment
      crossCountrySeconds
      debriefingSeconds
      failedPerformance
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instructor {
        ...UserFragment
      }
      instrumentSeconds
      lecture {
        ...LectureFragment
      }
      multiSeconds
      name
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      status
      student {
        ...UserFragment
      }
      submittedByInstructorAt
      totalSeconds
      userCategories {
        ...UserCategoryFragment
      }
      userProgram {
        ...UserProgramFragment
      }
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    registration {
      approvedByStudent
      approvedByStudentAt
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
      }
      briefingSeconds
      comment
      crossCountrySeconds
      debriefingSeconds
      failedPerformance
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instructor {
        ...UserFragment
      }
      instrumentSeconds
      lecture {
        ...LectureFragment
      }
      multiSeconds
      name
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      status
      student {
        ...UserFragment
      }
      submittedByInstructorAt
      totalSeconds
      userCategories {
        ...UserCategoryFragment
      }
      userProgram {
        ...UserProgramFragment
      }
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    startsAt
    status
    student {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
  }
}

Variables

{
  "booking": SingleStudentBookingInput,
  "skipWarnings": true
}

Response

{
  "data": {
    "createSingleStudentBooking": {
      "aircraft": Aircraft,
      "arrivalAirport": Airport,
      "audit": AuditInfo,
      "cancellation": BookingCancellation,
      "color": "abc123",
      "comment": "abc123",
      "departureAirport": Airport,
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "flightEndsAt": "2007-12-03T10:15:30Z",
      "flightStartsAt": "2007-12-03T10:15:30Z",
      "id": "abc123",
      "instructor": User,
      "observers": [User],
      "plannedLesson": Training,
      "registration": Training,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "student": User
    }
  }
}

Mutations
createTheoryReleaseBooking
Description

Creates a theory release booking
Response

Returns a TheoryReleaseBooking!
Arguments
Name 	Description
booking - TheoryReleaseBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateTheoryReleaseBooking(
  $booking: TheoryReleaseBookingInput!,
  $skipWarnings: Boolean
) {
  createTheoryReleaseBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    class {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    subject
    theoryCourse {
      audit {
        ...AuditInfoFragment
      }
      disabled
      id
      name
    }
  }
}

Variables

{
  "booking": TheoryReleaseBookingInput,
  "skipWarnings": true
}

Response

{
  "data": {
    "createTheoryReleaseBooking": {
      "audit": AuditInfo,
      "class": Class,
      "classroom": Classroom,
      "color": "abc123",
      "comment": "xyz789",
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "id": "abc123",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User],
      "subject": "xyz789",
      "theoryCourse": TheoryCourse
    }
  }
}

Mutations
createTypeQuestionnaireBooking
Description

Creates a type questionnaire booking
Response

Returns a TypeQuestionnaireBooking!
Arguments
Name 	Description
booking - TypeQuestionnaireBookingInput! 	
skipWarnings - Boolean 	
Example
Query

mutation CreateTypeQuestionnaireBooking(
  $booking: TypeQuestionnaireBookingInput!,
  $skipWarnings: Boolean
) {
  createTypeQuestionnaireBooking(
    booking: $booking,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    class {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    subject
    theoryCourse {
      audit {
        ...AuditInfoFragment
      }
      disabled
      id
      name
    }
  }
}

Variables

{
  "booking": TypeQuestionnaireBookingInput,
  "skipWarnings": true
}

Response

{
  "data": {
    "createTypeQuestionnaireBooking": {
      "audit": AuditInfo,
      "class": Class,
      "classroom": Classroom,
      "color": "xyz789",
      "comment": "abc123",
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "id": "abc123",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User],
      "subject": "abc123",
      "theoryCourse": TheoryCourse
    }
  }
}

Mutations
createUser
Description

Create a user in a organization
Response

Returns a User!
Arguments
Name 	Description
emergency - EmergencyInput 	
roles - [UserRoleEnum]! 	
user - UserInput! 	
Example
Query

mutation CreateUser(
  $emergency: EmergencyInput,
  $roles: [UserRoleEnum]!,
  $user: UserInput!
) {
  createUser(
    emergency: $emergency,
    roles: $roles,
    user: $user
  ) {
    accountingTransactions {
      edges {
        ...AccountingTransactionEdgeFragment
      }
      nodes {
        ...AccountingTransactionFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    availabilities {
      edges {
        ...UserAvailabilityEdgeFragment
      }
      nodes {
        ...UserAvailabilityFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    avatarUrl
    bookingTimeZone
    callSign
    contact {
      address
      city
      country
      dateOfBirth
      email
      gender
      phone
      zipcode
    }
    emergencyContact {
      address
      city
      country
      dateOfBirth
      email
      firstName
      lastName
      phone
      relation
      zipcode
    }
    firstName
    flightTimeZone
    flights {
      edges {
        ...FlightEdgeFragment
      }
      nodes {
        ...FlightFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    id
    lastName
    notes {
      adminNote
      instructorNote
      publicNote
    }
    overrideTimeZone
    references {
      caaRefNum
      reference
    }
    theoryTimeZone
    userPrograms {
      edges {
        ...UserProgramEdgeFragment
      }
      nodes {
        ...UserProgramFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
}

Variables

{
  "emergency": EmergencyInput,
  "roles": ["ADMINISTRATOR"],
  "user": UserInput
}

Response

{
  "data": {
    "createUser": {
      "accountingTransactions": AccountingTransactionConnection,
      "audit": AuditInfo,
      "availabilities": UserAvailabilityConnection,
      "avatarUrl": "xyz789",
      "bookingTimeZone": "abc123",
      "callSign": "xyz789",
      "contact": UserContact,
      "emergencyContact": UserEmergencyContact,
      "firstName": "abc123",
      "flightTimeZone": "xyz789",
      "flights": FlightConnection,
      "id": "xyz789",
      "lastName": "xyz789",
      "notes": UserNotes,
      "overrideTimeZone": false,
      "references": UserReferences,
      "theoryTimeZone": "xyz789",
      "userPrograms": UserProgramConnection
    }
  }
}

Mutations
deleteBooking
Description

Deletes a booking
Response

Returns a Boolean!
Arguments
Name 	Description
bookingId - ID! 	
recurrentBookingUpdateMethod - RecurrentBookingUpdateMethodEnum 	
Example
Query

mutation DeleteBooking(
  $bookingId: ID!,
  $recurrentBookingUpdateMethod: RecurrentBookingUpdateMethodEnum
) {
  deleteBooking(
    bookingId: $bookingId,
    recurrentBookingUpdateMethod: $recurrentBookingUpdateMethod
  )
}

Variables

{
  "bookingId": "4",
  "recurrentBookingUpdateMethod": "all"
}

Response

{"data": {"deleteBooking": true}}

Mutations
deleteBookings
Description

Bulk delete bookings
Response

Returns a String!
Arguments
Name 	Description
bookingIds - [ID!]! 	
recurrentBookingUpdateMethod - RecurrentBookingUpdateMethodEnum 	
sendEmails - Boolean 	
Example
Query

mutation DeleteBookings(
  $bookingIds: [ID!]!,
  $recurrentBookingUpdateMethod: RecurrentBookingUpdateMethodEnum,
  $sendEmails: Boolean
) {
  deleteBookings(
    bookingIds: $bookingIds,
    recurrentBookingUpdateMethod: $recurrentBookingUpdateMethod,
    sendEmails: $sendEmails
  )
}

Variables

{"bookingIds": [4], "recurrentBookingUpdateMethod": "all", "sendEmails": true}

Response

{"data": {"deleteBookings": "xyz789"}}

Mutations
myFlightLogger
Description

Get my|FlightLogger data, subsequent queries gets data across all accounts.
Response

Returns a MyFlightLoggerEntry
Example
Query

mutation MyFlightLogger {
  myFlightLogger {
    createBulkLogbookEntry {
      accountCompany
      accountDomain
      arrivalAirportName
      coPilotSeconds
      daySeconds
      departureAirportName
      documents {
        ...MemberAttachmentFragment
      }
      dualSeconds
      flightInstructorSeconds
      id
      ifTimeSeconds
      includeInFtl
      instructorSyntheticTrainingSeconds
      landingsDay
      landingsNight
      multiEngineIfrSeconds
      multiEngineVfrSeconds
      multiPilotSeconds
      nameOfPilotInCommand
      nightSeconds
      offBlock
      onBlock
      pilotInCommandSeconds
      registration
      remarksAndEndorsements
      singleEngineIfrSeconds
      singleEngineVfrSeconds
      syntheticTrainingSeconds
      totalSeconds
      typeOfAircraft
    }
    createLogbookEntry {
      accountCompany
      accountDomain
      arrivalAirportName
      coPilotSeconds
      daySeconds
      departureAirportName
      documents {
        ...MemberAttachmentFragment
      }
      dualSeconds
      flightInstructorSeconds
      id
      ifTimeSeconds
      includeInFtl
      instructorSyntheticTrainingSeconds
      landingsDay
      landingsNight
      multiEngineIfrSeconds
      multiEngineVfrSeconds
      multiPilotSeconds
      nameOfPilotInCommand
      nightSeconds
      offBlock
      onBlock
      pilotInCommandSeconds
      registration
      remarksAndEndorsements
      singleEngineIfrSeconds
      singleEngineVfrSeconds
      syntheticTrainingSeconds
      totalSeconds
      typeOfAircraft
    }
    createSimLogbookEntry {
      accountCompany
      accountDomain
      arrivalAirportName
      coPilotSeconds
      daySeconds
      departureAirportName
      documents {
        ...MemberAttachmentFragment
      }
      dualSeconds
      flightInstructorSeconds
      id
      ifTimeSeconds
      includeInFtl
      instructorSyntheticTrainingSeconds
      landingsDay
      landingsNight
      multiEngineIfrSeconds
      multiEngineVfrSeconds
      multiPilotSeconds
      nameOfPilotInCommand
      nightSeconds
      offBlock
      onBlock
      pilotInCommandSeconds
      registration
      remarksAndEndorsements
      singleEngineIfrSeconds
      singleEngineVfrSeconds
      syntheticTrainingSeconds
      totalSeconds
      typeOfAircraft
    }
    destroyLogbookEntry
    generateReport
    updateBulkLogbookEntry {
      accountCompany
      accountDomain
      arrivalAirportName
      coPilotSeconds
      daySeconds
      departureAirportName
      documents {
        ...MemberAttachmentFragment
      }
      dualSeconds
      flightInstructorSeconds
      id
      ifTimeSeconds
      includeInFtl
      instructorSyntheticTrainingSeconds
      landingsDay
      landingsNight
      multiEngineIfrSeconds
      multiEngineVfrSeconds
      multiPilotSeconds
      nameOfPilotInCommand
      nightSeconds
      offBlock
      onBlock
      pilotInCommandSeconds
      registration
      remarksAndEndorsements
      singleEngineIfrSeconds
      singleEngineVfrSeconds
      syntheticTrainingSeconds
      totalSeconds
      typeOfAircraft
    }
    updateLogbookEntry {
      accountCompany
      accountDomain
      arrivalAirportName
      coPilotSeconds
      daySeconds
      departureAirportName
      documents {
        ...MemberAttachmentFragment
      }
      dualSeconds
      flightInstructorSeconds
      id
      ifTimeSeconds
      includeInFtl
      instructorSyntheticTrainingSeconds
      landingsDay
      landingsNight
      multiEngineIfrSeconds
      multiEngineVfrSeconds
      multiPilotSeconds
      nameOfPilotInCommand
      nightSeconds
      offBlock
      onBlock
      pilotInCommandSeconds
      registration
      remarksAndEndorsements
      singleEngineIfrSeconds
      singleEngineVfrSeconds
      syntheticTrainingSeconds
      totalSeconds
      typeOfAircraft
    }
    updateSimLogbookEntry {
      accountCompany
      accountDomain
      arrivalAirportName
      coPilotSeconds
      daySeconds
      departureAirportName
      documents {
        ...MemberAttachmentFragment
      }
      dualSeconds
      flightInstructorSeconds
      id
      ifTimeSeconds
      includeInFtl
      instructorSyntheticTrainingSeconds
      landingsDay
      landingsNight
      multiEngineIfrSeconds
      multiEngineVfrSeconds
      multiPilotSeconds
      nameOfPilotInCommand
      nightSeconds
      offBlock
      onBlock
      pilotInCommandSeconds
      registration
      remarksAndEndorsements
      singleEngineIfrSeconds
      singleEngineVfrSeconds
      syntheticTrainingSeconds
      totalSeconds
      typeOfAircraft
    }
  }
}

Response

{
  "data": {
    "myFlightLogger": {
      "createBulkLogbookEntry": Logbook,
      "createLogbookEntry": Logbook,
      "createSimLogbookEntry": Logbook,
      "destroyLogbookEntry": true,
      "generateReport": "xyz789",
      "updateBulkLogbookEntry": Logbook,
      "updateLogbookEntry": Logbook,
      "updateSimLogbookEntry": Logbook
    }
  }
}

Mutations
publishFlightTrack
Description

Publish flight tracks to flightlogger. Returns the flight_uuid if successful.
Response

Returns a FlightTrack!
Arguments
Name 	Description
engineOff - DateTime 	The engine off datetime.
engineOn - DateTime 	The engine on datetime.
flightUuid - String 	The unique flight identifier.
kmlUrl - String 	The URL to the KML file for the flight track.
landing - DateTime! 	The landing datetime.
offBlock - DateTime 	The off block datetime.
onBlock - DateTime 	The on block datetime.
providerName - String! 	The flight data provider.
registration - String! 	The aircraft registration whose tracks are to be published.
status - FlightTrackStatusEnum 	The flight status of the track. Defaults to uncompleted for new flights; omitted on update preserves existing status.
takeoff - DateTime! 	The takeoff datetime.
viewUrl - String 	The URL to view the flight.
Example
Query

mutation PublishFlightTrack(
  $engineOff: DateTime,
  $engineOn: DateTime,
  $flightUuid: String,
  $kmlUrl: String,
  $landing: DateTime!,
  $offBlock: DateTime,
  $onBlock: DateTime,
  $providerName: String!,
  $registration: String!,
  $status: FlightTrackStatusEnum,
  $takeoff: DateTime!,
  $viewUrl: String
) {
  publishFlightTrack(
    engineOff: $engineOff,
    engineOn: $engineOn,
    flightUuid: $flightUuid,
    kmlUrl: $kmlUrl,
    landing: $landing,
    offBlock: $offBlock,
    onBlock: $onBlock,
    providerName: $providerName,
    registration: $registration,
    status: $status,
    takeoff: $takeoff,
    viewUrl: $viewUrl
  ) {
    flightUuid
    status
  }
}

Variables

{
  "engineOff": "2007-12-03T10:15:30Z",
  "engineOn": "2007-12-03T10:15:30Z",
  "flightUuid": "xyz789",
  "kmlUrl": "xyz789",
  "landing": "2007-12-03T10:15:30Z",
  "offBlock": "2007-12-03T10:15:30Z",
  "onBlock": "2007-12-03T10:15:30Z",
  "providerName": "abc123",
  "registration": "xyz789",
  "status": "COMPLETED",
  "takeoff": "2007-12-03T10:15:30Z",
  "viewUrl": "xyz789"
}

Response

{
  "data": {
    "publishFlightTrack": {
      "flightUuid": "abc123",
      "status": "COMPLETED"
    }
  }
}

Mutations
rejectMaintenancePart
Description

Reject a maintenance part.
Response

Returns a MaintenancePart!
Arguments
Name 	Description
id - Id! 	
Example
Query

mutation RejectMaintenancePart($id: Id!) {
  rejectMaintenancePart(id: $id) {
    approvedAt
    approvedBy {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    expirationCycles
    expirationDate
    expirationLogSeconds
    expiresOnLog
    id
    maintenanceType {
      audit {
        ...AuditInfoFragment
      }
      createdAt
      disabled
      expiresOnCycles
      expiresOnDate
      expiresOnLog
      name
      requireSerialNumber
      requireUploadOfDocument
      triggerOnLogTime
      updatedAt
    }
    name
    plane {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    rejectedAt
    rejectedBy {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    serialNumber
    status
  }
}

Variables

{"id": Id}

Response

{
  "data": {
    "rejectMaintenancePart": {
      "approvedAt": "2007-12-03T10:15:30Z",
      "approvedBy": User,
      "audit": AuditInfo,
      "expirationCycles": 123,
      "expirationDate": "2007-12-03T10:15:30Z",
      "expirationLogSeconds": 987,
      "expiresOnLog": "AIRBORNE",
      "id": Id,
      "maintenanceType": Maintenance,
      "name": "abc123",
      "plane": Aircraft,
      "rejectedAt": "2007-12-03T10:15:30Z",
      "rejectedBy": User,
      "serialNumber": "abc123",
      "status": "APPROVED"
    }
  }
}

Mutations
updateClassTheoryBooking
Description

Updates a class theory booking
Response

Returns a ClassTheoryBooking!
Arguments
Name 	Description
booking - ClassTheoryBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateClassTheoryBooking(
  $booking: ClassTheoryBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateClassTheoryBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    class {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    subject
    theoryCourse {
      audit {
        ...AuditInfoFragment
      }
      disabled
      id
      name
    }
  }
}

Variables

{
  "booking": ClassTheoryBookingInput,
  "id": "4",
  "skipWarnings": false
}

Response

{
  "data": {
    "updateClassTheoryBooking": {
      "audit": AuditInfo,
      "class": Class,
      "classroom": Classroom,
      "color": "xyz789",
      "comment": "xyz789",
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "id": "xyz789",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User],
      "subject": "abc123",
      "theoryCourse": TheoryCourse
    }
  }
}

Mutations
updateCustomer
Description

Update a customer on the current account.
Response

Returns a Customer!
Arguments
Name 	Description
customer - CustomerInput! 	
id - ID! 	
Example
Query

mutation UpdateCustomer(
  $customer: CustomerInput!,
  $id: ID!
) {
  updateCustomer(
    customer: $customer,
    id: $id
  ) {
    address
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    city
    company
    country
    email
    fullName
    id
    name
    phone
    reference
    zipCode
  }
}

Variables

{"customer": CustomerInput, "id": 4}

Response

{
  "data": {
    "updateCustomer": {
      "address": "xyz789",
      "audit": AuditInfo,
      "city": "xyz789",
      "company": "xyz789",
      "country": "xyz789",
      "email": "xyz789",
      "fullName": "abc123",
      "id": "abc123",
      "name": "abc123",
      "phone": "abc123",
      "reference": "abc123",
      "zipCode": "xyz789"
    }
  }
}

Mutations
updateExamBooking
Description

Updates an exam booking
Response

Returns an ExamBooking!
Arguments
Name 	Description
booking - ExamBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateExamBooking(
  $booking: ExamBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateExamBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    class {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    subject
    theoryCourse {
      audit {
        ...AuditInfoFragment
      }
      disabled
      id
      name
    }
  }
}

Variables

{
  "booking": ExamBookingInput,
  "id": "4",
  "skipWarnings": false
}

Response

{
  "data": {
    "updateExamBooking": {
      "audit": AuditInfo,
      "class": Class,
      "classroom": Classroom,
      "color": "xyz789",
      "comment": "abc123",
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "id": "xyz789",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User],
      "subject": "xyz789",
      "theoryCourse": TheoryCourse
    }
  }
}

Mutations
updateExtraTheoryBooking
Description

Updates an extra theory booking
Response

Returns an ExtraTheoryBooking!
Arguments
Name 	Description
booking - ExtraTheoryBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateExtraTheoryBooking(
  $booking: ExtraTheoryBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateExtraTheoryBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    student {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
  }
}

Variables

{
  "booking": ExtraTheoryBookingInput,
  "id": "4",
  "skipWarnings": false
}

Response

{
  "data": {
    "updateExtraTheoryBooking": {
      "audit": AuditInfo,
      "classroom": Classroom,
      "color": "xyz789",
      "comment": "xyz789",
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "id": "xyz789",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "student": User
    }
  }
}

Mutations
updateMaintenanceBooking
Description

Update a maintenance booking.
Response

Returns a MaintenanceBooking!
Arguments
Name 	Description
booking - MaintenanceBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateMaintenanceBooking(
  $booking: MaintenanceBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateMaintenanceBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    aircraft {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    arrivalAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    color
    comment
    departureAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    emailNotifications
    endsAt
    externalReference
    flightEndsAt
    flightStartsAt
    id
    startsAt
    status
  }
}

Variables

{
  "booking": MaintenanceBookingInput,
  "id": "4",
  "skipWarnings": false
}

Response

{
  "data": {
    "updateMaintenanceBooking": {
      "aircraft": Aircraft,
      "arrivalAirport": Airport,
      "audit": AuditInfo,
      "color": "xyz789",
      "comment": "xyz789",
      "departureAirport": Airport,
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "flightEndsAt": "2007-12-03T10:15:30Z",
      "flightStartsAt": "2007-12-03T10:15:30Z",
      "id": "xyz789",
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED"
    }
  }
}

Mutations
updateMaintenancePart
Description

Update a maintenance part (returns it to pending approval when changed).
Response

Returns a MaintenancePart!
Arguments
Name 	Description
id - Id! 	
maintenancePart - MaintenancePartInput! 	
Example
Query

mutation UpdateMaintenancePart(
  $id: Id!,
  $maintenancePart: MaintenancePartInput!
) {
  updateMaintenancePart(
    id: $id,
    maintenancePart: $maintenancePart
  ) {
    approvedAt
    approvedBy {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    expirationCycles
    expirationDate
    expirationLogSeconds
    expiresOnLog
    id
    maintenanceType {
      audit {
        ...AuditInfoFragment
      }
      createdAt
      disabled
      expiresOnCycles
      expiresOnDate
      expiresOnLog
      name
      requireSerialNumber
      requireUploadOfDocument
      triggerOnLogTime
      updatedAt
    }
    name
    plane {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    rejectedAt
    rejectedBy {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    serialNumber
    status
  }
}

Variables

{
  "id": Id,
  "maintenancePart": MaintenancePartInput
}

Response

{
  "data": {
    "updateMaintenancePart": {
      "approvedAt": "2007-12-03T10:15:30Z",
      "approvedBy": User,
      "audit": AuditInfo,
      "expirationCycles": 123,
      "expirationDate": "2007-12-03T10:15:30Z",
      "expirationLogSeconds": 123,
      "expiresOnLog": "AIRBORNE",
      "id": Id,
      "maintenanceType": Maintenance,
      "name": "abc123",
      "plane": Aircraft,
      "rejectedAt": "2007-12-03T10:15:30Z",
      "rejectedBy": User,
      "serialNumber": "abc123",
      "status": "APPROVED"
    }
  }
}

Mutations
updateMeetingBooking
Description

Update a meeting booking.
Response

Returns a MeetingBooking!
Arguments
Name 	Description
booking - MeetingBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateMeetingBooking(
  $booking: MeetingBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateMeetingBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    participants {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
  }
}

Variables

{
  "booking": MeetingBookingInput,
  "id": "4",
  "skipWarnings": false
}

Response

{
  "data": {
    "updateMeetingBooking": {
      "audit": AuditInfo,
      "classroom": Classroom,
      "color": "abc123",
      "comment": "abc123",
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "id": "xyz789",
      "participants": [User],
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED"
    }
  }
}

Mutations
updateMultiStudentBooking
Description

Updates a multi student booking
Response

Returns a MultiStudentBooking!
Arguments
Name 	Description
booking - MultiStudentBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateMultiStudentBooking(
  $booking: MultiStudentBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateMultiStudentBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    aircraft {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    arrivalAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    cancellations {
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on ClassTheoryBooking {
          ...ClassTheoryBookingFragment
        }
        ... on ExamBooking {
          ...ExamBookingFragment
        }
        ... on ExtraTheoryBooking {
          ...ExtraTheoryBookingFragment
        }
        ... on MaintenanceBooking {
          ...MaintenanceBookingFragment
        }
        ... on MeetingBooking {
          ...MeetingBookingFragment
        }
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on OperationBooking {
          ...OperationBookingFragment
        }
        ... on ProgressTestBooking {
          ...ProgressTestBookingFragment
        }
        ... on RentalBooking {
          ...RentalBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
        ... on TheoryReleaseBooking {
          ...TheoryReleaseBookingFragment
        }
        ... on TypeQuestionnaireBooking {
          ...TypeQuestionnaireBookingFragment
        }
      }
      comment
      id
      title
      user {
        ...UserFragment
      }
    }
    color
    comment
    departureAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    emailNotifications
    endsAt
    externalReference
    flightEndsAt
    flightStartsAt
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    observers {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    plannedLessons {
      approvedByStudent
      approvedByStudentAt
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
      }
      briefingSeconds
      comment
      crossCountrySeconds
      debriefingSeconds
      failedPerformance
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instructor {
        ...UserFragment
      }
      instrumentSeconds
      lecture {
        ...LectureFragment
      }
      multiSeconds
      name
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      status
      student {
        ...UserFragment
      }
      submittedByInstructorAt
      totalSeconds
      userCategories {
        ...UserCategoryFragment
      }
      userProgram {
        ...UserProgramFragment
      }
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    registrations {
      approvedByStudent
      approvedByStudentAt
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
      }
      briefingSeconds
      comment
      crossCountrySeconds
      debriefingSeconds
      failedPerformance
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instructor {
        ...UserFragment
      }
      instrumentSeconds
      lecture {
        ...LectureFragment
      }
      multiSeconds
      name
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      status
      student {
        ...UserFragment
      }
      submittedByInstructorAt
      totalSeconds
      userCategories {
        ...UserCategoryFragment
      }
      userProgram {
        ...UserProgramFragment
      }
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
  }
}

Variables

{
  "booking": MultiStudentBookingInput,
  "id": "4",
  "skipWarnings": false
}

Response

{
  "data": {
    "updateMultiStudentBooking": {
      "aircraft": Aircraft,
      "arrivalAirport": Airport,
      "audit": AuditInfo,
      "cancellations": [BookingCancellation],
      "color": "xyz789",
      "comment": "xyz789",
      "departureAirport": Airport,
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "flightEndsAt": "2007-12-03T10:15:30Z",
      "flightStartsAt": "2007-12-03T10:15:30Z",
      "id": "abc123",
      "instructor": User,
      "observers": [User],
      "plannedLessons": [Training],
      "registrations": [Training],
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User]
    }
  }
}

Mutations
updateOperationBooking
Description

Updates a operation booking
Response

Returns an OperationBooking!
Arguments
Name 	Description
booking - OperationBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateOperationBooking(
  $booking: OperationBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateOperationBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    aircraft {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    arrivalAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    cancellation {
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on ClassTheoryBooking {
          ...ClassTheoryBookingFragment
        }
        ... on ExamBooking {
          ...ExamBookingFragment
        }
        ... on ExtraTheoryBooking {
          ...ExtraTheoryBookingFragment
        }
        ... on MaintenanceBooking {
          ...MaintenanceBookingFragment
        }
        ... on MeetingBooking {
          ...MeetingBookingFragment
        }
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on OperationBooking {
          ...OperationBookingFragment
        }
        ... on ProgressTestBooking {
          ...ProgressTestBookingFragment
        }
        ... on RentalBooking {
          ...RentalBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
        ... on TheoryReleaseBooking {
          ...TheoryReleaseBookingFragment
        }
        ... on TypeQuestionnaireBooking {
          ...TypeQuestionnaireBookingFragment
        }
      }
      comment
      id
      title
      user {
        ...UserFragment
      }
    }
    color
    comment
    crew {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    customer {
      address
      audit {
        ...AuditInfoFragment
      }
      city
      company
      country
      email
      fullName
      id
      name
      phone
      reference
      zipCode
    }
    departureAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    emailNotifications
    endsAt
    externalReference
    flightEndsAt
    flightStartsAt
    id
    operationType {
      audit {
        ...AuditInfoFragment
      }
      externalReference
      id
      name
      note
    }
    pic {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    registration {
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...OperationBookingFragment
      }
      comment
      crew {
        ...UserFragment
      }
      crossCountrySeconds
      customer {
        ...CustomerFragment
      }
      expensesInvoiceNumber
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      incomeInvoiceNumber
      instrumentSeconds
      multiSeconds
      nightSeconds
      operationType {
        ...OperationTypeFragment
      }
      pic {
        ...UserFragment
      }
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      totalSeconds
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    startsAt
    status
  }
}

Variables

{
  "booking": OperationBookingInput,
  "id": 4,
  "skipWarnings": false
}

Response

{
  "data": {
    "updateOperationBooking": {
      "aircraft": Aircraft,
      "arrivalAirport": Airport,
      "audit": AuditInfo,
      "cancellation": BookingCancellation,
      "color": "abc123",
      "comment": "xyz789",
      "crew": [User],
      "customer": Customer,
      "departureAirport": Airport,
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "flightEndsAt": "2007-12-03T10:15:30Z",
      "flightStartsAt": "2007-12-03T10:15:30Z",
      "id": "xyz789",
      "operationType": OperationType,
      "pic": User,
      "registration": Operation,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED"
    }
  }
}

Mutations
updateProgressTestBooking
Description

Updates a progress test booking
Response

Returns a ProgressTestBooking!
Arguments
Name 	Description
booking - ProgressTestBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateProgressTestBooking(
  $booking: ProgressTestBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateProgressTestBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    class {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    subject
    theoryCourse {
      audit {
        ...AuditInfoFragment
      }
      disabled
      id
      name
    }
  }
}

Variables

{
  "booking": ProgressTestBookingInput,
  "id": "4",
  "skipWarnings": true
}

Response

{
  "data": {
    "updateProgressTestBooking": {
      "audit": AuditInfo,
      "class": Class,
      "classroom": Classroom,
      "color": "abc123",
      "comment": "xyz789",
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "id": "xyz789",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User],
      "subject": "abc123",
      "theoryCourse": TheoryCourse
    }
  }
}

Mutations
updateRentalBooking
Description

Updates a rental booking
Response

Returns a RentalBooking!
Arguments
Name 	Description
booking - RentalBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateRentalBooking(
  $booking: RentalBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateRentalBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    aircraft {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    approved
    arrivalAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    cancellation {
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on ClassTheoryBooking {
          ...ClassTheoryBookingFragment
        }
        ... on ExamBooking {
          ...ExamBookingFragment
        }
        ... on ExtraTheoryBooking {
          ...ExtraTheoryBookingFragment
        }
        ... on MaintenanceBooking {
          ...MaintenanceBookingFragment
        }
        ... on MeetingBooking {
          ...MeetingBookingFragment
        }
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on OperationBooking {
          ...OperationBookingFragment
        }
        ... on ProgressTestBooking {
          ...ProgressTestBookingFragment
        }
        ... on RentalBooking {
          ...RentalBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
        ... on TheoryReleaseBooking {
          ...TheoryReleaseBookingFragment
        }
        ... on TypeQuestionnaireBooking {
          ...TypeQuestionnaireBookingFragment
        }
      }
      comment
      id
      title
      user {
        ...UserFragment
      }
    }
    color
    comment
    departureAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    emailNotifications
    endsAt
    externalReference
    flightEndsAt
    flightStartsAt
    id
    registration {
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ...RentalBookingFragment
      }
      comment
      crossCountrySeconds
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instrumentSeconds
      multiSeconds
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      renter {
        ...UserFragment
      }
      singleSeconds
      totalSeconds
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    renter {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
  }
}

Variables

{
  "booking": RentalBookingInput,
  "id": 4,
  "skipWarnings": true
}

Response

{
  "data": {
    "updateRentalBooking": {
      "aircraft": Aircraft,
      "approved": true,
      "arrivalAirport": Airport,
      "audit": AuditInfo,
      "cancellation": BookingCancellation,
      "color": "abc123",
      "comment": "abc123",
      "departureAirport": Airport,
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "flightEndsAt": "2007-12-03T10:15:30Z",
      "flightStartsAt": "2007-12-03T10:15:30Z",
      "id": "xyz789",
      "registration": Rental,
      "renter": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED"
    }
  }
}

Mutations
updateSingleStudentBooking
Description

Updates a single student booking
Response

Returns a SingleStudentBooking!
Arguments
Name 	Description
booking - SingleStudentBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateSingleStudentBooking(
  $booking: SingleStudentBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateSingleStudentBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    aircraft {
      aircraftClass
      aircraftType
      asymmetricTimeEnabled
      audit {
        ...AuditInfoFragment
      }
      auprtTimeEnabled
      availabilities {
        ...AircraftAvailabilityConnectionFragment
      }
      callSign
      currentAirport {
        ...AirportFragment
      }
      defaultEngineType
      defaultPMF
      disabled
      flights {
        ...FlightConnectionFragment
      }
      floatTimeEnabled
      fuelCoefficient
      fuelCoefficientMeasurement
      fuelCoefficientUnit
      homeAirport {
        ...AirportFragment
      }
      id
      instrumentTimeEnabled
      maintenanceParts {
        ...MaintenancePartConnectionFragment
      }
      model
      nextService {
        ...ServiceSummaryFragment
      }
      primaryLog {
        ...FlightLogConfigurationFragment
      }
      secondaryLog {
        ...FlightLogConfigurationFragment
      }
      taxiInTime
      taxiOutTime
      tertiaryLog {
        ...FlightLogConfigurationFragment
      }
      timerSeconds
      totalAirborneMinutes
      totalFuel
      totalLandings
      typeOfTimer
      typeOfTimerMeasurement
      worstMaintenanceWarning {
        ...MaintenanceWarningFragment
      }
      worstWarning {
        ...MaintenanceWarningFragment
      }
    }
    arrivalAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    cancellation {
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on ClassTheoryBooking {
          ...ClassTheoryBookingFragment
        }
        ... on ExamBooking {
          ...ExamBookingFragment
        }
        ... on ExtraTheoryBooking {
          ...ExtraTheoryBookingFragment
        }
        ... on MaintenanceBooking {
          ...MaintenanceBookingFragment
        }
        ... on MeetingBooking {
          ...MeetingBookingFragment
        }
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on OperationBooking {
          ...OperationBookingFragment
        }
        ... on ProgressTestBooking {
          ...ProgressTestBookingFragment
        }
        ... on RentalBooking {
          ...RentalBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
        ... on TheoryReleaseBooking {
          ...TheoryReleaseBookingFragment
        }
        ... on TypeQuestionnaireBooking {
          ...TypeQuestionnaireBookingFragment
        }
      }
      comment
      id
      title
      user {
        ...UserFragment
      }
    }
    color
    comment
    departureAirport {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    emailNotifications
    endsAt
    externalReference
    flightEndsAt
    flightStartsAt
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    observers {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    plannedLesson {
      approvedByStudent
      approvedByStudentAt
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
      }
      briefingSeconds
      comment
      crossCountrySeconds
      debriefingSeconds
      failedPerformance
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instructor {
        ...UserFragment
      }
      instrumentSeconds
      lecture {
        ...LectureFragment
      }
      multiSeconds
      name
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      status
      student {
        ...UserFragment
      }
      submittedByInstructorAt
      totalSeconds
      userCategories {
        ...UserCategoryFragment
      }
      userProgram {
        ...UserProgramFragment
      }
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    registration {
      approvedByStudent
      approvedByStudentAt
      asymmetricSeconds
      audit {
        ...AuditInfoFragment
      }
      booking {
        ... on MultiStudentBooking {
          ...MultiStudentBookingFragment
        }
        ... on SingleStudentBooking {
          ...SingleStudentBookingFragment
        }
      }
      briefingSeconds
      comment
      crossCountrySeconds
      debriefingSeconds
      failedPerformance
      flights {
        ...FlightFragment
      }
      floatSeconds
      id
      ifrDualSeconds
      ifrSimSeconds
      ifrSpicSeconds
      instructor {
        ...UserFragment
      }
      instrumentSeconds
      lecture {
        ...LectureFragment
      }
      multiSeconds
      name
      nightSeconds
      pilotFlyingSeconds
      pilotMonitoringSeconds
      singleSeconds
      status
      student {
        ...UserFragment
      }
      submittedByInstructorAt
      totalSeconds
      userCategories {
        ...UserCategoryFragment
      }
      userProgram {
        ...UserProgramFragment
      }
      vfrDualSeconds
      vfrSimSeconds
      vfrSoloSeconds
      vfrSpicSeconds
    }
    startsAt
    status
    student {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
  }
}

Variables

{
  "booking": SingleStudentBookingInput,
  "id": "4",
  "skipWarnings": false
}

Response

{
  "data": {
    "updateSingleStudentBooking": {
      "aircraft": Aircraft,
      "arrivalAirport": Airport,
      "audit": AuditInfo,
      "cancellation": BookingCancellation,
      "color": "abc123",
      "comment": "abc123",
      "departureAirport": Airport,
      "emailNotifications": false,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "flightEndsAt": "2007-12-03T10:15:30Z",
      "flightStartsAt": "2007-12-03T10:15:30Z",
      "id": "abc123",
      "instructor": User,
      "observers": [User],
      "plannedLesson": Training,
      "registration": Training,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "student": User
    }
  }
}

Mutations
updateTheoryReleaseBooking
Description

Updates a theory release booking
Response

Returns a TheoryReleaseBooking!
Arguments
Name 	Description
booking - TheoryReleaseBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateTheoryReleaseBooking(
  $booking: TheoryReleaseBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateTheoryReleaseBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    class {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    subject
    theoryCourse {
      audit {
        ...AuditInfoFragment
      }
      disabled
      id
      name
    }
  }
}

Variables

{
  "booking": TheoryReleaseBookingInput,
  "id": "4",
  "skipWarnings": false
}

Response

{
  "data": {
    "updateTheoryReleaseBooking": {
      "audit": AuditInfo,
      "class": Class,
      "classroom": Classroom,
      "color": "xyz789",
      "comment": "abc123",
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "xyz789",
      "id": "abc123",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User],
      "subject": "xyz789",
      "theoryCourse": TheoryCourse
    }
  }
}

Mutations
updateTypeQuestionnaireBooking
Description

Updates a type questionnaire booking
Response

Returns a TypeQuestionnaireBooking!
Arguments
Name 	Description
booking - TypeQuestionnaireBookingInput! 	
id - ID! 	
skipWarnings - Boolean 	
Example
Query

mutation UpdateTypeQuestionnaireBooking(
  $booking: TypeQuestionnaireBookingInput!,
  $id: ID!,
  $skipWarnings: Boolean
) {
  updateTypeQuestionnaireBooking(
    booking: $booking,
    id: $id,
    skipWarnings: $skipWarnings
  ) {
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    class {
      audit {
        ...AuditInfoFragment
      }
      id
      name
      users {
        ...UserFragment
      }
    }
    classroom {
      audit {
        ...AuditInfoFragment
      }
      id
      name
    }
    color
    comment
    emailNotifications
    endsAt
    externalReference
    id
    instructor {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    startsAt
    status
    students {
      accountingTransactions {
        ...AccountingTransactionConnectionFragment
      }
      audit {
        ...AuditInfoFragment
      }
      availabilities {
        ...UserAvailabilityConnectionFragment
      }
      avatarUrl
      bookingTimeZone
      callSign
      contact {
        ...UserContactFragment
      }
      emergencyContact {
        ...UserEmergencyContactFragment
      }
      firstName
      flightTimeZone
      flights {
        ...FlightConnectionFragment
      }
      id
      lastName
      notes {
        ...UserNotesFragment
      }
      overrideTimeZone
      references {
        ...UserReferencesFragment
      }
      theoryTimeZone
      userPrograms {
        ...UserProgramConnectionFragment
      }
    }
    subject
    theoryCourse {
      audit {
        ...AuditInfoFragment
      }
      disabled
      id
      name
    }
  }
}

Variables

{
  "booking": TypeQuestionnaireBookingInput,
  "id": "4",
  "skipWarnings": false
}

Response

{
  "data": {
    "updateTypeQuestionnaireBooking": {
      "audit": AuditInfo,
      "class": Class,
      "classroom": Classroom,
      "color": "xyz789",
      "comment": "xyz789",
      "emailNotifications": true,
      "endsAt": "2007-12-03T10:15:30Z",
      "externalReference": "abc123",
      "id": "abc123",
      "instructor": User,
      "startsAt": "2007-12-03T10:15:30Z",
      "status": "CANCELLED",
      "students": [User],
      "subject": "abc123",
      "theoryCourse": TheoryCourse
    }
  }
}

Mutations
updateUser
Description

Update a user in a organization
Response

Returns a User!
Arguments
Name 	Description
emergency - EmergencyInput 	
id - ID! 	
user - UserInput 	
Example
Query

mutation UpdateUser(
  $emergency: EmergencyInput,
  $id: ID!,
  $user: UserInput
) {
  updateUser(
    emergency: $emergency,
    id: $id,
    user: $user
  ) {
    accountingTransactions {
      edges {
        ...AccountingTransactionEdgeFragment
      }
      nodes {
        ...AccountingTransactionFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    audit {
      createdAt
      createdById
      updatedAt
      updatedById
    }
    availabilities {
      edges {
        ...UserAvailabilityEdgeFragment
      }
      nodes {
        ...UserAvailabilityFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    avatarUrl
    bookingTimeZone
    callSign
    contact {
      address
      city
      country
      dateOfBirth
      email
      gender
      phone
      zipcode
    }
    emergencyContact {
      address
      city
      country
      dateOfBirth
      email
      firstName
      lastName
      phone
      relation
      zipcode
    }
    firstName
    flightTimeZone
    flights {
      edges {
        ...FlightEdgeFragment
      }
      nodes {
        ...FlightFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    id
    lastName
    notes {
      adminNote
      instructorNote
      publicNote
    }
    overrideTimeZone
    references {
      caaRefNum
      reference
    }
    theoryTimeZone
    userPrograms {
      edges {
        ...UserProgramEdgeFragment
      }
      nodes {
        ...UserProgramFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
}

Variables

{
  "emergency": EmergencyInput,
  "id": "4",
  "user": UserInput
}

Response

{
  "data": {
    "updateUser": {
      "accountingTransactions": AccountingTransactionConnection,
      "audit": AuditInfo,
      "availabilities": UserAvailabilityConnection,
      "avatarUrl": "abc123",
      "bookingTimeZone": "xyz789",
      "callSign": "xyz789",
      "contact": UserContact,
      "emergencyContact": UserEmergencyContact,
      "firstName": "xyz789",
      "flightTimeZone": "abc123",
      "flights": FlightConnection,
      "id": "abc123",
      "lastName": "xyz789",
      "notes": UserNotes,
      "overrideTimeZone": false,
      "references": UserReferences,
      "theoryTimeZone": "xyz789",
      "userPrograms": UserProgramConnection
    }
  }
}

Types
Account
Description

The FlightLogger account scoped by the API key.
Fields
Field Name 	Description
company - String! 	
country - String 	
countryCode - String 	
disabled - Boolean! 	
logoUrl - String 	The URL of the account logo, if present.
moneyLocale - String 	
subdomain - String! 	
Example

{
  "company": "xyz789",
  "country": "xyz789",
  "countryCode": "xyz789",
  "disabled": false,
  "logoUrl": "abc123",
  "moneyLocale": "xyz789",
  "subdomain": "xyz789"
}

Types
AccountTransactionTypeDescriptionInput
Fields
Input Field 	Description
freeText - String 	A free-text description of the transaction type. Must be provided if transactionTypeId is not provided.
transactionTypeId - Id 	The unique identifier of the transaction type. Must be provided if freeText is not provided.
Example

{
  "freeText": "abc123",
  "transactionTypeId": Id
}

Types
AccountingTransaction
Description

Represents a transfer of credit in the accounting module.
Fields
Field Name 	Description
audit - AuditInfo 	
balanceCents - BigInt 	The remaining balance after this transaction.
balanceCurrency - String 	The currency of the account balance.
comment - String 	
createdAt - DateTime! 	
externalReference - String 	
id - Id! 	
priceCents - BigInt 	The amount of credit charged.
priceCurrency - String 	The currency of the credit transfer.
transactionId - Int! 	The unique identifier of the transaction.
transactionType - String 	The type/category of the transaction.
Example

{
  "audit": AuditInfo,
  "balanceCents": {},
  "balanceCurrency": "xyz789",
  "comment": "xyz789",
  "createdAt": "2007-12-03T10:15:30Z",
  "externalReference": "xyz789",
  "id": Id,
  "priceCents": {},
  "priceCurrency": "abc123",
  "transactionId": 987,
  "transactionType": "abc123"
}

Types
AccountingTransactionConnection
Description

The connection type for AccountingTransaction.
Fields
Field Name 	Description
edges - [AccountingTransactionEdge] 	A list of edges.
nodes - [AccountingTransaction] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [AccountingTransactionEdge],
  "nodes": [AccountingTransaction],
  "pageInfo": PageInfo
}

Types
AccountingTransactionEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - AccountingTransaction 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": AccountingTransaction
}

Types
AccountingTransactionType
Description

A valid transaction type for creating accounting transactions (e.g. Cash Payment, Wire Transfer).
Fields
Field Name 	Description
cents - BigInt! 	
currency - String! 	
description - String 	
id - Id! 	
Example

{
  "cents": {},
  "currency": "xyz789",
  "description": "xyz789",
  "id": Id
}

Types
Aircraft
Description

An aircraft.
Fields
Field Name 	Description
aircraftClass - AircraftClassEnum! 	The classification of the aircraft.
aircraftType - AircraftTypeEnum! 	
asymmetricTimeEnabled - Boolean 	
audit - AuditInfo 	
auprtTimeEnabled - Boolean 	
availabilities - AircraftAvailabilityConnection! 	Aircraft availability events in a given span of time.
Arguments
after - String

Returns the elements in the list that come after the specified cursor.
before - String

Returns the elements in the list that come before the specified cursor.
first - Int

Returns the first n elements from the list.
from - DateTime

If provided, will only fetch events beginning after this point in time. Defaults to beginning of current day.
last - Int

Returns the last n elements from the list.
to - DateTime

If provided, will only fetch events ending before this point in time. Defaults to end of day of from time.
callSign - String! 	
currentAirport - Airport 	
defaultEngineType - EngineTypeEnum 	Default simulated engine type. Applies only to simulators.
defaultPMF - PmfTypeEnum 	The default PM/PF value. Null if PM/PF is not enabled.
disabled - Boolean! 	
flights - FlightConnection! 	The flights performed by the aircraft.
Arguments
after - String

Returns the elements in the list that come after the specified cursor.
all - Boolean

If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String

Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime

If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int

Returns the first n elements from the list.
from - DateTime

If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int

Returns the last n elements from the list.
to - DateTime

If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
floatTimeEnabled - Boolean 	
fuelCoefficient - Float 	Null for simulators.
fuelCoefficientMeasurement - FuelMeasurementUnitEnum 	Volumetric measurement unit used for the fuel of the aircraft. Null for simulators.
fuelCoefficientUnit - FuelCoefficientBasisEnum 	Flight time measurement basis used in fuel coefficient calculations. Null for simulators.
homeAirport - Airport 	
id - Id! 	
instrumentTimeEnabled - Boolean 	
maintenanceParts - MaintenancePartConnection! 	The maintenance parts of the aircraft.
Arguments
after - String

Returns the elements in the list that come after the specified cursor.
before - String

Returns the elements in the list that come before the specified cursor.
first - Int

Returns the first n elements from the list.
last - Int

Returns the last n elements from the list.
status - [MaintenancePartStatusEnum!]

If provided, will only provide maintenance parts with a matching status.
model - String! 	The aircraft model-number.
nextService - ServiceSummary 	
primaryLog - FlightLogConfiguration 	Will only be null if the requesting user is not allowed to read it.
secondaryLog - FlightLogConfiguration 	
taxiInTime - Int 	Default taxi in time, in minutes. Null if taxi times are not enabled for the aircraft. Use flightLogConfiguration instead.
taxiOutTime - Int 	Default taxi out time, in minutes. Null if taxi times are not enabled for the aircraft. Use flightLogConfiguration instead.
tertiaryLog - FlightLogConfiguration 	
timerSeconds - Int 	Current value of the aircraft timer. Null if timer is not enabled for the aircraft. Use flightLogConfiguration instead.
totalAirborneMinutes - Int 	The total airborne time of the aircraft, in minutes. Use flightLogConfiguration instead.
totalFuel - Float 	Current fuel of the aircraft. Unit of measurement matches fuel coefficient unit. Null for simulators.
totalLandings - Int 	The total amount of landings performed by the aircraft. Null for simulators.
typeOfTimer - FlightTimerEnum 	Method of air time capture used by the aircraft. Null if timer is not enabled for the aircraft. Use flightLogConfiguration instead.
typeOfTimerMeasurement - DurationFormatEnum 	Time measurement unit for the aircraft timer. Null if timer is not enabled for the aircraft. Use flightLogConfiguration instead.
worstMaintenanceWarning - MaintenanceWarning 	
worstWarning - MaintenanceWarning 	Use worstMaintenanceWarning instead.
Example

{
  "aircraftClass": "MULTI_ENGINE",
  "aircraftType": "AIRPLANE",
  "asymmetricTimeEnabled": true,
  "audit": AuditInfo,
  "auprtTimeEnabled": true,
  "availabilities": AircraftAvailabilityConnection,
  "callSign": "abc123",
  "currentAirport": Airport,
  "defaultEngineType": "MULTI_ENGINE",
  "defaultPMF": "PILOT_FLYING",
  "disabled": true,
  "flights": FlightConnection,
  "floatTimeEnabled": false,
  "fuelCoefficient": 123.45,
  "fuelCoefficientMeasurement": "LITERS",
  "fuelCoefficientUnit": "AIRBORNE",
  "homeAirport": Airport,
  "id": Id,
  "instrumentTimeEnabled": true,
  "maintenanceParts": MaintenancePartConnection,
  "model": "abc123",
  "nextService": ServiceSummary,
  "primaryLog": FlightLogConfiguration,
  "secondaryLog": FlightLogConfiguration,
  "taxiInTime": 123,
  "taxiOutTime": 987,
  "tertiaryLog": FlightLogConfiguration,
  "timerSeconds": 123,
  "totalAirborneMinutes": 987,
  "totalFuel": 123.45,
  "totalLandings": 123,
  "typeOfTimer": "AIRBORNE",
  "typeOfTimerMeasurement": "DECIMAL_HOURS",
  "worstMaintenanceWarning": MaintenanceWarning,
  "worstWarning": MaintenanceWarning
}

Types
AircraftAvailability
Description

An aircraft availability event. Indicates the availability of an aircraft in a certain timespan.
Fields
Field Name 	Description
endsAt - DateTime! 	
startsAt - DateTime! 	
Example

{
  "endsAt": "2007-12-03T10:15:30Z",
  "startsAt": "2007-12-03T10:15:30Z"
}

Types
AircraftAvailabilityConnection
Description

The connection type for AircraftAvailability.
Fields
Field Name 	Description
edges - [AircraftAvailabilityEdge] 	A list of edges.
nodes - [AircraftAvailability] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [AircraftAvailabilityEdge],
  "nodes": [AircraftAvailability],
  "pageInfo": PageInfo
}

Types
AircraftAvailabilityEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - AircraftAvailability 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": AircraftAvailability
}

Types
AircraftBooking
Description

Fields common to all bookings tied to aircraft.
Fields
Field Name 	Description
aircraft - Aircraft 	Will only be null if the requesting user is not allowed to read it.
arrivalAirport - Airport 	
departureAirport - Airport 	
flightEndsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
flightStartsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
Possible Types
AircraftBooking Types

MaintenanceBooking

MultiStudentBooking

OperationBooking

RentalBooking

SingleStudentBooking
Example

{
  "aircraft": Aircraft,
  "arrivalAirport": Airport,
  "departureAirport": Airport,
  "flightEndsAt": "2007-12-03T10:15:30Z",
  "flightStartsAt": "2007-12-03T10:15:30Z"
}

Types
AircraftClassEnum
Description

Aircraft engine class.
Values
Enum Value 	Description

MULTI_ENGINE
	

SIMULATOR
	

SINGLE_ENGINE
	
Example

"MULTI_ENGINE"

Types
AircraftConnection
Description

The connection type for Aircraft.
Fields
Field Name 	Description
edges - [AircraftEdge] 	A list of edges.
nodes - [Aircraft] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [AircraftEdge],
  "nodes": [Aircraft],
  "pageInfo": PageInfo
}

Types
AircraftEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Aircraft 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": Aircraft
}

Types
AircraftTypeEnum
Description

Aircraft/vessel type.
Values
Enum Value 	Description

AIRPLANE
	

HELICOPTER
	
Example

"AIRPLANE"

Types
Airport
Description

An airport.
Fields
Field Name 	Description
audit - AuditInfo 	
id - Id! 	
name - String! 	The name given to the airport.
Example

{
  "audit": AuditInfo,
  "id": Id,
  "name": "abc123"
}

Types
Attachment
Description

A file attached to another entity.
Fields
Field Name 	Description
audit - AuditInfo 	
fileName - String! 	The name of the underlying file.
fileType - String 	The file type of the underlying file.
fileUrl - String 	Address used to retrieve the underlying file.
id - String! 	
Example

{
  "audit": AuditInfo,
  "fileName": "xyz789",
  "fileType": "abc123",
  "fileUrl": "xyz789",
  "id": "xyz789"
}

Types
AttachmentInput
Fields
Input Field 	Description
fileUrl - String! 	
filename - String! 	
id - String 	
isRemoved - Boolean 	
Example

{
  "fileUrl": "xyz789",
  "filename": "abc123",
  "id": "abc123",
  "isRemoved": true
}

Types
AttendanceStatusEnum
Description

Represents a user's attendance as part of a theory registration.
Values
Enum Value 	Description

ATTENDED
	

DID_NOT_ATTEND
	

NOT_STARTED
	

PARTIALLY_ATTENDED
	
Example

"ATTENDED"

Types
AuditInfo
Description

Fields pertaining to auditing (modification history tracking) of an entity.
Fields
Field Name 	Description
createdAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
createdById - Id 	
updatedAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
updatedById - Id 	
Example

{
  "createdAt": "2007-12-03T10:15:30Z",
  "createdById": Id,
  "updatedAt": "2007-12-03T10:15:30Z",
  "updatedById": Id
}

Types
Auditable
Description

An entity whose modification and creation times/instigators are tracked.
Fields
Field Name 	Description
audit - AuditInfo 	
Possible Types
Auditable Types

AccountingTransaction

Aircraft

Airport

Attachment

BookingCancellation

Class

ClassTheory

ClassTheoryBooking

Classroom

Customer

DutyTime

Exam

ExamBooking

ExamParticipation

ExtraTheory

ExtraTheoryBooking

Flight

Landing

Lecture

Maintenance

MaintenanceBooking

MaintenancePart

MaintenanceWarning

MeetingBooking

MemberAttachment

MultiStudentBooking

Operation

OperationBooking

OperationType

Program

ProgramPhase

ProgramRevision

ProgressTest

ProgressTestBooking

Rental

RentalBooking

SingleStudentBooking

Sitting

SubjectCategory

TheoryCourse

TheoryParticipation

TheoryRelease

TheoryReleaseBooking

Training

TypeQuestionnaire

TypeQuestionnaireBooking

User

UserProgram
Example

{"audit": AuditInfo}

Types
BigInt
Description

Represents non-fractional signed whole numeric values. Since the value may exceed the size of a 32-bit integer, it's encoded as a string.
Example

{}

Types
Booking
Description

Fields common to all booking types.
Fields
Field Name 	Description
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
id - String! 	
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
Possible Types
Booking Types

ClassTheoryBooking

ExamBooking

ExtraTheoryBooking

MaintenanceBooking

MeetingBooking

MultiStudentBooking

OperationBooking

ProgressTestBooking

RentalBooking

SingleStudentBooking

TheoryReleaseBooking

TypeQuestionnaireBooking
Example

{
  "color": "abc123",
  "comment": "xyz789",
  "emailNotifications": false,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "xyz789",
  "id": "xyz789",
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED"
}

Types
BookingCancellation
Description

A cancellation of a booking, stating the reasoning why.
Fields
Field Name 	Description
audit - AuditInfo 	
booking - BookingUnion! 	
comment - String 	
id - String! 	
title - String! 	
user - User 	
Example

{
  "audit": AuditInfo,
  "booking": ClassTheoryBooking,
  "comment": "xyz789",
  "id": "xyz789",
  "title": "xyz789",
  "user": User
}

Types
BookingStatusEnum
Description

The current state of the bookings' lifecycle
Values
Enum Value 	Description

CANCELLED
	

COMPLETED
	

OPEN
	

PARTIALLY_COMPLETED
	
Example

"CANCELLED"

Types
BookingSubtypeEnum
Values
Enum Value 	Description

CLASS_THEORY
	

EXAM
	

EXTRA_THEORY
	

MAINTENANCE
	

MEETING
	

MULTI_STUDENT
	

OPERATION
	

PROGRESS_TEST
	

RENTAL
	

SINGLE_STUDENT
	

THEORY_RELEASE
	

TYPE_QUESTIONNAIRE
	
Example

"CLASS_THEORY"

Types
BookingUnion
Description

Represents specific booking subtypes.
Types
Union Types

ClassTheoryBooking

ExamBooking

ExtraTheoryBooking

MaintenanceBooking

MeetingBooking

MultiStudentBooking

OperationBooking

ProgressTestBooking

RentalBooking

SingleStudentBooking

TheoryReleaseBooking

TypeQuestionnaireBooking
Example

ClassTheoryBooking

Types
BookingUnionConnection
Description

The connection type for BookingUnion.
Fields
Field Name 	Description
edges - [BookingUnionEdge] 	A list of edges.
nodes - [BookingUnion] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [BookingUnionEdge],
  "nodes": [ClassTheoryBooking],
  "pageInfo": PageInfo
}

Types
BookingUnionEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - BookingUnion 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": ClassTheoryBooking
}

Types
Boolean
Description

The Boolean scalar type represents true or false.
Types
BulkLogbookEntryInput
Fields
Input Field 	Description
coPilotSeconds - Int 	
daySeconds - Int 	
documents - [AttachmentInput!] 	
dualSeconds - Int 	
flightInstructorSeconds - Int 	
id - ID 	
ifTimeSeconds - Int 	
instructorSyntheticTrainingSeconds - Int 	
landingsDay - Int 	
landingsNight - Int 	
multiEngineIfrSeconds - Int 	
multiEngineVfrSeconds - Int 	
multiPilotSeconds - Int 	
nameOfPilotInCommand - String 	
nightSeconds - Int 	
offBlock - DateTime! 	ISO 8610
pilotInCommandSeconds - Int 	
registration - String 	
remarksAndEndorsements - String 	
singleEngineIfrSeconds - Int 	
singleEngineVfrSeconds - Int 	
syntheticTrainingSeconds - Int 	
typeOfAircraft - String 	
Example

{
  "coPilotSeconds": 987,
  "daySeconds": 123,
  "documents": [AttachmentInput],
  "dualSeconds": 987,
  "flightInstructorSeconds": 123,
  "id": "4",
  "ifTimeSeconds": 123,
  "instructorSyntheticTrainingSeconds": 987,
  "landingsDay": 123,
  "landingsNight": 987,
  "multiEngineIfrSeconds": 123,
  "multiEngineVfrSeconds": 987,
  "multiPilotSeconds": 123,
  "nameOfPilotInCommand": "abc123",
  "nightSeconds": 123,
  "offBlock": "2007-12-03T10:15:30Z",
  "pilotInCommandSeconds": 123,
  "registration": "xyz789",
  "remarksAndEndorsements": "abc123",
  "singleEngineIfrSeconds": 123,
  "singleEngineVfrSeconds": 987,
  "syntheticTrainingSeconds": 987,
  "typeOfAircraft": "xyz789"
}

Types
Class
Description

A class with a cohort of students.
Fields
Field Name 	Description
audit - AuditInfo 	
id - String! 	
name - String! 	
users - [User]! 	
Example

{
  "audit": AuditInfo,
  "id": "xyz789",
  "name": "xyz789",
  "users": [User]
}

Types
ClassConnection
Description

The connection type for Class.
Fields
Field Name 	Description
edges - [ClassEdge] 	A list of edges.
nodes - [Class] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [ClassEdge],
  "nodes": [Class],
  "pageInfo": PageInfo
}

Types
ClassEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Class 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": Class
}

Types
ClassTheory
Description

A class theory registration.
Fields
Field Name 	Description
attachments - [Attachment] 	
audit - AuditInfo 	
booking - ClassTheoryBooking 	
class - Class 	
comment - String 	
endsAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
expensesInvoiceNumber - String 	Only present if an expense invoice is filled.
groundTrainingSubject - SubjectCategory 	Will only be null if the requesting user is not allowed to read it.
id - String! 	
instructor - User 	Will only be null if the requesting user is not allowed to read.
participations - [TheoryParticipation]! 	
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
subject - String 	
subjectCategory - SubjectCategory 	Will only be null if the requesting user is not allowed to read it. Renamed to groundTrainingSubject
Example

{
  "attachments": [Attachment],
  "audit": AuditInfo,
  "booking": ClassTheoryBooking,
  "class": Class,
  "comment": "abc123",
  "endsAt": "2007-12-03T10:15:30Z",
  "expensesInvoiceNumber": "abc123",
  "groundTrainingSubject": SubjectCategory,
  "id": "xyz789",
  "instructor": User,
  "participations": [TheoryParticipation],
  "startsAt": "2007-12-03T10:15:30Z",
  "subject": "abc123",
  "subjectCategory": SubjectCategory
}

Types
ClassTheoryBooking
Description

A booking for a class theory.
Fields
Field Name 	Description
audit - AuditInfo 	
class - Class 	
classroom - Classroom 	The location (i.e. classroom) in which the booking will take place. Will only be null if the requesting user is not allowed to read it.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
id - String! 	
instructor - User 	The instructor/examiner slated to oversee the booking. Will only be null if the requesting user is not allowed to read it.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
students - [User]! 	Students slated to participate in the activity.
subject - String 	The subject or name of the theoretical activity.
theoryCourse - TheoryCourse 	Will only be null if the requesting user is not allowed to read it.
Example

{
  "audit": AuditInfo,
  "class": Class,
  "classroom": Classroom,
  "color": "abc123",
  "comment": "xyz789",
  "emailNotifications": true,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "xyz789",
  "id": "abc123",
  "instructor": User,
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED",
  "students": [User],
  "subject": "xyz789",
  "theoryCourse": TheoryCourse
}

Types
ClassTheoryBookingInput
Fields
Input Field 	Description
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
classroomId - ID! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
instructorById - ID! 	
notifyViaEmail - Boolean 	
programId - ID 	
programRevisionId - ID 	
recurrenceRule - String 	
studentsById - [StudentInput!] 	
subject - String 	
subjectCategoryId - ID! 	
teamId - ID 	
theoryCourse - ID 	
theoryLessonId - ID 	
Example

{
  "awaitingApproval": false,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "classroomId": 4,
  "color": "abc123",
  "comment": "abc123",
  "externalReference": "abc123",
  "instructorById": "4",
  "notifyViaEmail": false,
  "programId": 4,
  "programRevisionId": 4,
  "recurrenceRule": "xyz789",
  "studentsById": [StudentInput],
  "subject": "abc123",
  "subjectCategoryId": "4",
  "teamId": 4,
  "theoryCourse": 4,
  "theoryLessonId": 4
}

Types
ClassTheoryConnection
Description

The connection type for ClassTheory.
Fields
Field Name 	Description
edges - [ClassTheoryEdge] 	A list of edges.
nodes - [ClassTheory] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [ClassTheoryEdge],
  "nodes": [ClassTheory],
  "pageInfo": PageInfo
}

Types
ClassTheoryEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - ClassTheory 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": ClassTheory
}

Types
Classroom
Description

A ground school location (usually a classroom, briefing room, conference room, etc.).
Fields
Field Name 	Description
audit - AuditInfo 	
id - Id! 	
name - String! 	
Example

{
  "audit": AuditInfo,
  "id": Id,
  "name": "xyz789"
}

Types
ClassroomConnection
Description

The connection type for Classroom.
Fields
Field Name 	Description
edges - [ClassroomEdge] 	A list of edges.
nodes - [Classroom] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [ClassroomEdge],
  "nodes": [Classroom],
  "pageInfo": PageInfo
}

Types
ClassroomEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Classroom 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": Classroom
}

Types
Customer
Description

A customer. Used during operations.
Fields
Field Name 	Description
address - String 	
audit - AuditInfo 	
city - String 	
company - String 	
country - String 	
email - String 	
fullName - String 	
id - String! 	
name - String! 	A short representation of the name of the customer.
phone - String 	
reference - String 	
zipCode - String 	
Example

{
  "address": "abc123",
  "audit": AuditInfo,
  "city": "abc123",
  "company": "abc123",
  "country": "xyz789",
  "email": "xyz789",
  "fullName": "abc123",
  "id": "abc123",
  "name": "abc123",
  "phone": "abc123",
  "reference": "abc123",
  "zipCode": "xyz789"
}

Types
CustomerConnection
Description

The connection type for Customer.
Fields
Field Name 	Description
edges - [CustomerEdge] 	A list of edges.
nodes - [Customer] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [CustomerEdge],
  "nodes": [Customer],
  "pageInfo": PageInfo
}

Types
CustomerEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Customer 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": Customer
}

Types
CustomerInput
Fields
Input Field 	Description
address - String 	Street address.
city - String 	City name.
company - String 	Company name. Either company or fullName must be provided.
country - String 	Country name or ISO alpha-2 code.
email - String 	Customer email address.
fullName - String 	Contact full name. Either fullName or company must be provided.
phone - String 	Customer phone number.
reference - String 	External reference. Used to identify the customer in external systems/sources.
zipCode - String 	Postal or ZIP code.
Example

{
  "address": "abc123",
  "city": "abc123",
  "company": "xyz789",
  "country": "xyz789",
  "email": "xyz789",
  "fullName": "abc123",
  "phone": "xyz789",
  "reference": "xyz789",
  "zipCode": "xyz789"
}

Types
Date
Description

An ISO 8601-encoded date
Example

"2007-12-03"

Types
DateTime
Description

An ISO 8601-encoded datetime
Example

"2007-12-03T10:15:30Z"

Types
Deletion
Description

Represents the deletion of an entity.
Fields
Field Name 	Description
entityId - Id! 	The id of the entity.
entityType - VersionableEntityEnum! 	The type of the entity.
eventType - VersionEventTypeEnum! 	The type of versioning that took place.
happenedAt - DateTime! 	The point in time at which the event took place. Expects a date-time to be specified in ISO 8610 format.
whoDoneIt - User 	The instigator of the event.
Example

{
  "entityId": Id,
  "entityType": "BOOKING",
  "eventType": "DELETION",
  "happenedAt": "2007-12-03T10:15:30Z",
  "whoDoneIt": User
}

Types
DurationFormatEnum
Description

Format of a duration of time.
Values
Enum Value 	Description

DECIMAL_HOURS
	Decimal number of hours representation with 1 decimal place. Example: 2.2 (2 hours and 12 minutes)

HOURS_MINUTES
	Digital clock representation. Example: 2:15 (2 hours and 15 minutes)

LONG_DECIMAL_HOURS
	Decimal number of hours representation with 2 decimal places. Example: 2.25 (2 hours and 15 minutes)
Example

"DECIMAL_HOURS"

Types
DutyTime
Description

A duty time registration.
Fields
Field Name 	Description
audit - AuditInfo 	
comment - String 	
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
expensesInvoiceNumber - String 	Only present if an expense invoice is filled.
id - Id! 	
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
state - DutyTimeStateEnum! 	
user - User 	Will only be null if the requesting user is not allowed to read it.
Example

{
  "audit": AuditInfo,
  "comment": "abc123",
  "endsAt": "2007-12-03T10:15:30Z",
  "expensesInvoiceNumber": "abc123",
  "id": Id,
  "startsAt": "2007-12-03T10:15:30Z",
  "state": "AWAITS_APPROVAL",
  "user": User
}

Types
DutyTimeConnection
Description

The connection type for DutyTime.
Fields
Field Name 	Description
edges - [DutyTimeEdge] 	A list of edges.
nodes - [DutyTime] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [DutyTimeEdge],
  "nodes": [DutyTime],
  "pageInfo": PageInfo
}

Types
DutyTimeEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - DutyTime 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": DutyTime
}

Types
DutyTimeStateEnum
Values
Enum Value 	Description

AWAITS_APPROVAL
	

DRAFT
	

FINALIZED
	
Example

"AWAITS_APPROVAL"

Types
EmergencyInput
Fields
Input Field 	Description
address - String 	
city - String 	
country - String 	
email - String 	
firstName - String 	
lastName - String 	
phone - String 	
postCode - String 	
relationShip - String 	
Example

{
  "address": "xyz789",
  "city": "xyz789",
  "country": "abc123",
  "email": "abc123",
  "firstName": "abc123",
  "lastName": "abc123",
  "phone": "abc123",
  "postCode": "abc123",
  "relationShip": "xyz789"
}

Types
EngineTypeEnum
Description

Engine type.
Values
Enum Value 	Description

MULTI_ENGINE
	

SINGLE_ENGINE
	
Example

"MULTI_ENGINE"

Types
Exam
Description

An exam registration.
Fields
Field Name 	Description
attachments - [Attachment] 	
audit - AuditInfo 	
booking - ExamBooking 	
class - Class 	
endsAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
examiner - User 	Will only be null if the requesting user is not allowed to read.
expensesInvoiceNumber - String 	Only present if an expense invoice is filled.
groundTrainingSubject - SubjectCategory 	Will only be null if the requesting user is not allowed to read it.
id - Id! 	
participations - [ExamParticipation]! 	
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
subjectCategory - SubjectCategory 	Will only be null if the requesting user is not allowed to read it. Renamed to groundTrainingSubject
Example

{
  "attachments": [Attachment],
  "audit": AuditInfo,
  "booking": ExamBooking,
  "class": Class,
  "endsAt": "2007-12-03T10:15:30Z",
  "examiner": User,
  "expensesInvoiceNumber": "abc123",
  "groundTrainingSubject": SubjectCategory,
  "id": Id,
  "participations": [ExamParticipation],
  "startsAt": "2007-12-03T10:15:30Z",
  "subjectCategory": SubjectCategory
}

Types
ExamBooking
Description

A booking for an exam.
Fields
Field Name 	Description
audit - AuditInfo 	
class - Class 	
classroom - Classroom 	The location (i.e. classroom) in which the booking will take place. Will only be null if the requesting user is not allowed to read it.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
id - String! 	
instructor - User 	The instructor/examiner slated to oversee the booking. Will only be null if the requesting user is not allowed to read it.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
students - [User]! 	Students slated to participate in the activity.
subject - String 	The subject or name of the theoretical activity.
theoryCourse - TheoryCourse 	Will only be null if the requesting user is not allowed to read it.
Example

{
  "audit": AuditInfo,
  "class": Class,
  "classroom": Classroom,
  "color": "abc123",
  "comment": "xyz789",
  "emailNotifications": false,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "abc123",
  "id": "xyz789",
  "instructor": User,
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED",
  "students": [User],
  "subject": "xyz789",
  "theoryCourse": TheoryCourse
}

Types
ExamBookingInput
Fields
Input Field 	Description
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
classroomId - ID! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
instructorById - ID! 	
notifyViaEmail - Boolean 	
programId - ID 	
programRevisionId - ID 	
recurrenceRule - String 	
studentsById - [StudentInput!] 	
subject - String 	
subjectCategoryId - ID! 	
teamId - ID 	
theoryCourse - ID 	
theoryLessonId - ID 	
Example

{
  "awaitingApproval": true,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "classroomId": 4,
  "color": "xyz789",
  "comment": "abc123",
  "externalReference": "xyz789",
  "instructorById": "4",
  "notifyViaEmail": true,
  "programId": 4,
  "programRevisionId": "4",
  "recurrenceRule": "abc123",
  "studentsById": [StudentInput],
  "subject": "xyz789",
  "subjectCategoryId": 4,
  "teamId": 4,
  "theoryCourse": "4",
  "theoryLessonId": "4"
}

Types
ExamConnection
Description

The connection type for Exam.
Fields
Field Name 	Description
edges - [ExamEdge] 	A list of edges.
nodes - [Exam] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [ExamEdge],
  "nodes": [Exam],
  "pageInfo": PageInfo
}

Types
ExamEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Exam 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": Exam
}

Types
ExamParticipation
Description

Represents a students participation in an exam.
Fields
Field Name 	Description
attendanceStatus - AttendanceStatusEnum! 	
attendedSeconds - Int 	Actual attended classroom hours (in seconds) for this participation. Zero if did_not_attend.
audit - AuditInfo 	
endsAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
grade - String 	The grade given to the participant. Not applicable to class theories.
id - String! 	
incomeInvoiceNumber - String 	Only present if an income invoice is filled.
referenceNumber - String 	
sitting - Sitting 	
startsAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
studentComment - String 	Comment given by the student. Not applicable to exams.
user - User 	
Example

{
  "attendanceStatus": "ATTENDED",
  "attendedSeconds": 987,
  "audit": AuditInfo,
  "endsAt": "2007-12-03T10:15:30Z",
  "grade": "abc123",
  "id": "abc123",
  "incomeInvoiceNumber": "abc123",
  "referenceNumber": "xyz789",
  "sitting": Sitting,
  "startsAt": "2007-12-03T10:15:30Z",
  "studentComment": "xyz789",
  "user": User
}

Types
ExportTypeEnum
Description

A type of report
Values
Enum Value 	Description

CSV
	

PDF
	
Example

"CSV"

Types
ExtraTheory
Description

An extra theory registration.
Fields
Field Name 	Description
attachments - [Attachment]! 	
audit - AuditInfo 	
booking - ExtraTheoryBooking 	
description - String 	
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
expensesInvoiceNumber - String 	Only present if an expense invoice is filled.
id - Id! 	
incomeInvoiceNumber - String 	Only present if an income invoice is filled.
instructor - User 	Will only be null if the requesting user is not allowed to read.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
user - User 	Will only be null if the requesting user is not allowed to read it.
Example

{
  "attachments": [Attachment],
  "audit": AuditInfo,
  "booking": ExtraTheoryBooking,
  "description": "abc123",
  "endsAt": "2007-12-03T10:15:30Z",
  "expensesInvoiceNumber": "xyz789",
  "id": Id,
  "incomeInvoiceNumber": "xyz789",
  "instructor": User,
  "startsAt": "2007-12-03T10:15:30Z",
  "user": User
}

Types
ExtraTheoryBooking
Description

A booking for an extra theory lesson.
Fields
Field Name 	Description
audit - AuditInfo 	
classroom - Classroom 	The location (i.e. classroom) in which the booking will take place. Will only be null if the requesting user is not allowed to read it.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
id - String! 	
instructor - User 	Will only be null if the requesting user is not allowed to read it.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
student - User 	Will only be null if the requesting user is not allowed to read it.
Example

{
  "audit": AuditInfo,
  "classroom": Classroom,
  "color": "abc123",
  "comment": "abc123",
  "emailNotifications": true,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "abc123",
  "id": "xyz789",
  "instructor": User,
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED",
  "student": User
}

Types
ExtraTheoryBookingInput
Fields
Input Field 	Description
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
classroomId - ID! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
instructorById - ID! 	
notifyViaEmail - Boolean 	
programRevisionId - ID! 	
recurrenceRule - String 	
studentById - StudentInput! 	
Example

{
  "awaitingApproval": false,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "classroomId": 4,
  "color": "abc123",
  "comment": "abc123",
  "externalReference": "xyz789",
  "instructorById": 4,
  "notifyViaEmail": true,
  "programRevisionId": "4",
  "recurrenceRule": "abc123",
  "studentById": StudentInput
}

Types
ExtraTheoryConnection
Description

The connection type for ExtraTheory.
Fields
Field Name 	Description
edges - [ExtraTheoryEdge] 	A list of edges.
nodes - [ExtraTheory] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [ExtraTheoryEdge],
  "nodes": [ExtraTheory],
  "pageInfo": PageInfo
}

Types
ExtraTheoryEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - ExtraTheory 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": ExtraTheory
}

Types
Flight
Description

A flight registration.
Fields
Field Name 	Description
accountingTransactions - [AccountingTransaction] 	Account transactions incurred by the flight.
activityRegistration - FlightRegistration 	The specific activity registration associated with the flight (e.g. training, rental, operation, etc.)
aircraft - Aircraft 	The aircraft performing the flight.
arrivalAirport - Airport 	The airport registered at the arrival of the flight. Will always be present for a non-simulator flight.
atSeconds - Int! 	
audit - AuditInfo 	
auprtSeconds - Int! 	
calculatedFuelUsage - String 	Uses the planes fuel coefficient and unit to determine the fuel usage of the flight. Unit of measurement matches that of the aircraft.
crossCountrySeconds - Int! 	
daySeconds - Int! 	
departureAirport - Airport 	The airport registered at the departure of the flight. Will always be present for a non-simulator flight.
departureFuel - String 	The total fuel before flight. Unit of measurement matches that of the aircraft.
departureFuelAdded - String 	The amount of fuel added before the flight. Unit of measurement matches that of the aircraft.
departureOilAdded - String 	The amount of oil added before the flight. Unit of measurement matches that of the aircraft.
departureOilAddedTwo - String 	The amount of oil added to the right engine before the flight. Unit of measurement matches that of the aircraft engine.
expensesInvoiceNumber - String 	Only present if an expense invoice is filled.
flightType - FlightTypeEnum 	
ftSeconds - Int! 	
id - Id! 	
ifSeconds - Int! 	
ifrSeconds - Int! 	
incomeInvoiceNumber - String 	Only present if an income invoice is filled.
landing - DateTime 	The point in time at which the aircraft landed. Expects a date-time to be specified in ISO 8610 format. Use flightLog instead.
landings - [Landing] 	The landing(s) performed during the flight.
localSeconds - Int! 	
nightSeconds - Int! 	
offBlock - DateTime! 	The point in time of the beginning of the off-block portion of the flight. Expects a date-time to be specified in ISO 8610 format. Use flightLog instead.
onBlock - DateTime! 	The point in time of the beginning of the on-block portion of the flight. Expects a date-time to be specified in ISO 8610 format. Use flightLog instead.
pilotFlyingSeconds - Int! 	
pilotMonitoringSeconds - Int! 	
primaryLog - FlightLog 	Will only be null if the requesting user is not allowed to read it.
secondaryLog - FlightLog 	
takeoff - DateTime 	The point in time at which the aircraft took off. Expects a date-time to be specified in ISO 8610 format. Use flightLog instead.
tertiaryLog - FlightLog 	
timerFinishSeconds - Int 	The timer value at the end of the flight. Will never be null if the aircraft uses timer. Use flightLog instead.
timerStartSeconds - Int 	The timer value at the beginning of the flight. Will never be null if the aircraft uses timer. Use flightLog instead.
vfrSeconds - Int! 	
Example

{
  "accountingTransactions": [AccountingTransaction],
  "activityRegistration": FlightRegistration,
  "aircraft": Aircraft,
  "arrivalAirport": Airport,
  "atSeconds": 987,
  "audit": AuditInfo,
  "auprtSeconds": 987,
  "calculatedFuelUsage": "xyz789",
  "crossCountrySeconds": 123,
  "daySeconds": 123,
  "departureAirport": Airport,
  "departureFuel": "abc123",
  "departureFuelAdded": "abc123",
  "departureOilAdded": "abc123",
  "departureOilAddedTwo": "xyz789",
  "expensesInvoiceNumber": "abc123",
  "flightType": "DUAL",
  "ftSeconds": 123,
  "id": Id,
  "ifSeconds": 123,
  "ifrSeconds": 123,
  "incomeInvoiceNumber": "abc123",
  "landing": "2007-12-03T10:15:30Z",
  "landings": [Landing],
  "localSeconds": 987,
  "nightSeconds": 123,
  "offBlock": "2007-12-03T10:15:30Z",
  "onBlock": "2007-12-03T10:15:30Z",
  "pilotFlyingSeconds": 123,
  "pilotMonitoringSeconds": 123,
  "primaryLog": FlightLog,
  "secondaryLog": FlightLog,
  "takeoff": "2007-12-03T10:15:30Z",
  "tertiaryLog": FlightLog,
  "timerFinishSeconds": 987,
  "timerStartSeconds": 987,
  "vfrSeconds": 123
}

Types
FlightConnection
Description

The connection type for Flight.
Fields
Field Name 	Description
edges - [FlightEdge] 	A list of edges.
nodes - [Flight] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [FlightEdge],
  "nodes": [Flight],
  "pageInfo": PageInfo
}

Types
FlightEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Flight 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": Flight
}

Types
FlightLog
Description

A log registration.
Fields
Field Name 	Description
durationSeconds - Int! 	The duration of the log, in seconds.
endsAt - DateTime 	The point in time of the end of the log. Expects a date-time to be specified in ISO 8610 format. Will be null if the log measurement type is decimal.
finishSeconds - Int 	The timer value at the end of the log. Will be null if the log measurement type is hours minutes.
flyingDurationSeconds - Int! 	The flying duration in seconds.
id - Id! 	The id of the log.
startSeconds - Int 	The timer value at the beginning of the log. Will be null if the log measurement type is hours minutes.
startsAt - DateTime 	The point in time of the beginning of the log. Expects a date-time to be specified in ISO 8610 format. Will be null if the log measurement type is decimal and not primary log.
type - FlightTimerEnum! 	The type of log.
Example

{
  "durationSeconds": 123,
  "endsAt": "2007-12-03T10:15:30Z",
  "finishSeconds": 123,
  "flyingDurationSeconds": 987,
  "id": Id,
  "startSeconds": 987,
  "startsAt": "2007-12-03T10:15:30Z",
  "type": "AIRBORNE"
}

Types
FlightLogConfiguration
Description

A log configuration.
Fields
Field Name 	Description
actionButtonsIsEnabled - Boolean! 	Whether or not the log has action buttons.
durationWarningPercent - Int 	The percentage of the log duration that will trigger a warning.
id - Id! 	The id of the log.
measurementType - LogMeasurementEnum! 	The type of measurement used for the log.
offsetWarningSecondsEnd - Int 	The end of the offset warning.
offsetWarningSecondsStart - Int 	The start of the offset warning.
prefillIsEnabled - Boolean! 	Whether or not the log is pre-filled.
totalSeconds - Int! 	The total seconds of the log.
type - FlightTimerEnum! 	The type of log.
Example

{
  "actionButtonsIsEnabled": true,
  "durationWarningPercent": 987,
  "id": Id,
  "measurementType": "DECIMAL_HOURS",
  "offsetWarningSecondsEnd": 987,
  "offsetWarningSecondsStart": 123,
  "prefillIsEnabled": false,
  "totalSeconds": 123,
  "type": "AIRBORNE"
}

Types
FlightRegistration
Description

Represents something that has flights.
Fields
Field Name 	Description
asymmetricSeconds - Int! 	
crossCountrySeconds - Int! 	
flights - [Flight]! 	
floatSeconds - Int! 	
id - Id! 	
ifrDualSeconds - Int! 	
ifrSimSeconds - Int! 	
ifrSpicSeconds - Int! 	
instrumentSeconds - Int! 	
multiSeconds - Int! 	
nightSeconds - Int! 	
pilotFlyingSeconds - Int! 	
pilotMonitoringSeconds - Int! 	
singleSeconds - Int! 	
totalSeconds - Int! 	
vfrDualSeconds - Int! 	
vfrSimSeconds - Int! 	
vfrSoloSeconds - Int! 	
vfrSpicSeconds - Int! 	
Possible Types
FlightRegistration Types

Operation

Rental

Training
Example

{
  "asymmetricSeconds": 123,
  "crossCountrySeconds": 123,
  "flights": [Flight],
  "floatSeconds": 123,
  "id": Id,
  "ifrDualSeconds": 987,
  "ifrSimSeconds": 123,
  "ifrSpicSeconds": 987,
  "instrumentSeconds": 123,
  "multiSeconds": 123,
  "nightSeconds": 987,
  "pilotFlyingSeconds": 123,
  "pilotMonitoringSeconds": 123,
  "singleSeconds": 987,
  "totalSeconds": 123,
  "vfrDualSeconds": 987,
  "vfrSimSeconds": 987,
  "vfrSoloSeconds": 123,
  "vfrSpicSeconds": 123
}

Types
FlightTimerEnum
Description

Flight time measurement method.
Values
Enum Value 	Description

AIRBORNE
	

AIRSWITCH
	

BLOCK
	

DATCON
	

EDU
	

FLIGHT_TIME
	

HEATER_HOBBS
	

HOBBS
	

TACH
	

VDO
	
Example

"AIRBORNE"

Types
FlightTrack
Description

Represents the tracking status of a flight.
Fields
Field Name 	Description
flightUuid - String 	The UUID of the flight.
status - FlightTrackStatusEnum! 	The status of the flight track.
Example

{
  "flightUuid": "abc123",
  "status": "COMPLETED"
}

Types
FlightTrackStatusEnum
Description

Aircraft engine class.
Values
Enum Value 	Description

COMPLETED
	

UNCOMPLETED
	
Example

"COMPLETED"

Types
FlightTypeEnum
Description

Type of flight.
Values
Enum Value 	Description

DUAL
	

SIM
	

SOLO
	

SPIC
	
Example

"DUAL"

Types
Float
Description

The Float scalar type represents signed double-precision fractional values as specified by IEEE 754.
Example

987.65

Types
FuelCoefficientBasisEnum
Description

Flight time measurement basis used in fuel coefficient calculations.
Values
Enum Value 	Description

AIRBORNE
	

AIRSWITCH
	

BLOCK
	

DATCON
	

EDU
	

FLIGHT_TIME
	

HEATER_HOBBS
	

HOBBS
	

TACH
	

VDO
	
Example

"AIRBORNE"

Types
FuelMeasurementUnitEnum
Description

Unit of measurement for fuel.
Values
Enum Value 	Description

LITERS
	

USG
	
Example

"LITERS"

Types
GenderEnum
Description

Gender options for a user.
Values
Enum Value 	Description

FEMALE
	

MALE
	

OTHER
	

PREFER_NOT_TO_SAY
	

UNKNOWN
	
Example

"FEMALE"

Types
GenderInputEnum
Description

Gender input options for a user.
Values
Enum Value 	Description

FEMALE
	

MALE
	

OTHER
	

PREFER_NOT_TO_SAY
	
Example

"FEMALE"

Types
GradedCompetency
Fields
Field Name 	Description
coreCompetencyName - String 	
grade - String 	
gradedIndicators - [GradedIndicator] 	
id - String! 	
normGrade - String 	
Example

{
  "coreCompetencyName": "abc123",
  "grade": "xyz789",
  "gradedIndicators": [GradedIndicator],
  "id": "xyz789",
  "normGrade": "abc123"
}

Types
GradedIndicator
Fields
Field Name 	Description
id - String! 	
performanceIndicatorName - String! 	
Example

{
  "id": "xyz789",
  "performanceIndicatorName": "xyz789"
}

Types
GroundBooking
Description

Fields common to all bookings tied to ground resources (i.e. classrooms).
Fields
Field Name 	Description
classroom - Classroom 	The location (i.e. classroom) in which the booking will take place. Will only be null if the requesting user is not allowed to read it.
Possible Types
GroundBooking Types

ClassTheoryBooking

ExamBooking

ExtraTheoryBooking

MeetingBooking

ProgressTestBooking

TheoryReleaseBooking

TypeQuestionnaireBooking
Example

{"classroom": Classroom}

Types
ID
Description

The ID scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as "4") or integer (such as 4) input value will be accepted as an ID.
Example

"4"

Types
Id
Description

An unique identifier
Example

Id

Types
Int
Description

The Int scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
Example

987

Types
Landing
Description

A landing done as part of a Flight.
Fields
Field Name 	Description
airport - Airport 	The airport at which the landing took place. Will only be null if the requesting user is not allowed to read it.
audit - AuditInfo 	
id - Id! 	
isArrival - Boolean! 	True if the landing is the last landing (arrival).
landingType - LandingTypeEnum! 	
landingTypeCount - Int! 	
nightLanding - Boolean! 	
Example

{
  "airport": Airport,
  "audit": AuditInfo,
  "id": Id,
  "isArrival": true,
  "landingType": "APPROACH",
  "landingTypeCount": 987,
  "nightLanding": true
}

Types
LandingTypeEnum
Values
Enum Value 	Description

APPROACH
	

GO_AROUND
	

LANDING
	

TOUCH_AND_GO
	
Example

"APPROACH"

Types
Lecture
Description

A lecture/lesson on a program. Not to be confused with a Training, which is a completed lecture/lesson registration.
Fields
Field Name 	Description
audit - AuditInfo 	
auprtMinutes - Int! 	
briefingMinutes - Int! 	The duration of the briefing, in minutes.
crossCountryMinutes - Int! 	
debriefingMinutes - Int! 	The duration of the de-briefing, in minutes.
id - Id! 	
ifrDualMinutes - Int! 	
ifrSimMinutes - Int! 	
ifrSpicMinutes - Int! 	
instrumentFlightMinutes - Int! 	
lessonCategory - LessonCategoryEnum! 	
multiEngineMinutes - Int! 	
name - String! 	
nightMinutes - Int! 	
pilotFlyingMinutes - Int! 	
pilotMonitoringMinutes - Int! 	
programPhase - ProgramPhase 	Will only be null if the requesting user is not allowed to read it.
vfrDualMinutes - Int! 	
vfrSimMinutes - Int! 	
vfrSoloMinutes - Int! 	
vfrSpicMinutes - Int! 	
Example

{
  "audit": AuditInfo,
  "auprtMinutes": 123,
  "briefingMinutes": 987,
  "crossCountryMinutes": 987,
  "debriefingMinutes": 123,
  "id": Id,
  "ifrDualMinutes": 987,
  "ifrSimMinutes": 123,
  "ifrSpicMinutes": 123,
  "instrumentFlightMinutes": 123,
  "lessonCategory": "FINAL_STAGE_CHECK",
  "multiEngineMinutes": 123,
  "name": "abc123",
  "nightMinutes": 987,
  "pilotFlyingMinutes": 123,
  "pilotMonitoringMinutes": 123,
  "programPhase": ProgramPhase,
  "vfrDualMinutes": 987,
  "vfrSimMinutes": 987,
  "vfrSoloMinutes": 987,
  "vfrSpicMinutes": 123
}

Types
LessonCategoryEnum
Description

The category/type of a lesson within a flight training program.
Values
Enum Value 	Description

FINAL_STAGE_CHECK
	

FLIGHT_LESSON
	

OFFICIAL_SKILL_TEST
	

PROFICIENCY_CHECK
	

STAGE_CHECK
	
Example

"FINAL_STAGE_CHECK"

Types
LogMeasurementEnum
Description

Format of a duration of time.
Values
Enum Value 	Description

DECIMAL_HOURS
	Decimal number of hours representation with 1 decimal place. Example: 2.2 (2 hours and 12 minutes)

HOURS_MINUTES
	Digital clock representation. Example: 2:15 (2 hours and 15 minutes)

LONG_DECIMAL_HOURS
	Decimal number of hours representation with 2 decimal places. Example: 2.25 (2 hours and 15 minutes)

TIMESTAMP
	Timestamp with date and time. Example: 2023-12-24 13:37
Example

"DECIMAL_HOURS"

Types
Logbook
Description

A Logbook
Fields
Field Name 	Description
accountCompany - String 	
accountDomain - String 	
arrivalAirportName - String 	
coPilotSeconds - Int 	
daySeconds - Int 	Flight time at day.
departureAirportName - String 	
documents - [MemberAttachment] 	Entries will only be null if the requesting user is not allowed to read them.
dualSeconds - Int 	
flightInstructorSeconds - Int 	
id - Id! 	
ifTimeSeconds - Int 	
includeInFtl - Boolean 	
instructorSyntheticTrainingSeconds - Int 	
landingsDay - Int 	
landingsNight - Int 	
multiEngineIfrSeconds - Int 	
multiEngineVfrSeconds - Int 	
multiPilotSeconds - Int 	
nameOfPilotInCommand - String 	
nightSeconds - Int 	Flight time at night.
offBlock - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
onBlock - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
pilotInCommandSeconds - Int 	
registration - String 	
remarksAndEndorsements - String 	
singleEngineIfrSeconds - Int 	
singleEngineVfrSeconds - Int 	
syntheticTrainingSeconds - Int 	
totalSeconds - Int 	Total flight time.
typeOfAircraft - String 	
Example

{
  "accountCompany": "abc123",
  "accountDomain": "xyz789",
  "arrivalAirportName": "xyz789",
  "coPilotSeconds": 987,
  "daySeconds": 123,
  "departureAirportName": "abc123",
  "documents": [MemberAttachment],
  "dualSeconds": 987,
  "flightInstructorSeconds": 987,
  "id": Id,
  "ifTimeSeconds": 987,
  "includeInFtl": true,
  "instructorSyntheticTrainingSeconds": 123,
  "landingsDay": 123,
  "landingsNight": 123,
  "multiEngineIfrSeconds": 987,
  "multiEngineVfrSeconds": 987,
  "multiPilotSeconds": 123,
  "nameOfPilotInCommand": "abc123",
  "nightSeconds": 987,
  "offBlock": "2007-12-03T10:15:30Z",
  "onBlock": "2007-12-03T10:15:30Z",
  "pilotInCommandSeconds": 123,
  "registration": "abc123",
  "remarksAndEndorsements": "xyz789",
  "singleEngineIfrSeconds": 123,
  "singleEngineVfrSeconds": 987,
  "syntheticTrainingSeconds": 123,
  "totalSeconds": 987,
  "typeOfAircraft": "xyz789"
}

Types
LogbookConnection
Description

The connection type for Logbook.
Fields
Field Name 	Description
edges - [LogbookEdge] 	A list of edges.
nodes - [Logbook] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [LogbookEdge],
  "nodes": [Logbook],
  "pageInfo": PageInfo
}

Types
LogbookEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Logbook 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": Logbook
}

Types
LogbookEntryInput
Fields
Input Field 	Description
arrivalAirportName - String! 	
coPilotSeconds - Int 	
departureAirportName - String! 	
dualSeconds - Int 	
engineType - EngineTypeEnum! 	
flightInstructorSeconds - Int 	
id - ID 	
ifrSeconds - Int 	
landingsDay - Int 	
landingsNight - Int 	
multiPilotSeconds - Int 	
nameOfPilotInCommand - String! 	
nightSeconds - Int 	Flight time at night.
offBlock - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
onBlock - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
pilotInCommandSeconds - Int 	
registration - String! 	
remarksAndEndorsements - String 	
totalSeconds - Int! 	Total flight time.
typeOfAircraft - String! 	
vfrSeconds - Int 	
Example

{
  "arrivalAirportName": "xyz789",
  "coPilotSeconds": 987,
  "departureAirportName": "xyz789",
  "dualSeconds": 123,
  "engineType": "MULTI_ENGINE",
  "flightInstructorSeconds": 987,
  "id": "4",
  "ifrSeconds": 123,
  "landingsDay": 123,
  "landingsNight": 123,
  "multiPilotSeconds": 987,
  "nameOfPilotInCommand": "abc123",
  "nightSeconds": 123,
  "offBlock": "2007-12-03T10:15:30Z",
  "onBlock": "2007-12-03T10:15:30Z",
  "pilotInCommandSeconds": 123,
  "registration": "abc123",
  "remarksAndEndorsements": "xyz789",
  "totalSeconds": 987,
  "typeOfAircraft": "abc123",
  "vfrSeconds": 123
}

Types
LogbookSorter
Values
Enum Value 	Description

USER_LOGBOOK_ENTRIES
	
Example

"USER_LOGBOOK_ENTRIES"

Types
LogbookSummation
Description

A Logbook
Fields
Field Name 	Description
coPilotSeconds - Int 	
daySeconds - Int 	Flight time at day.
dualSeconds - Int 	
flightInstructorSeconds - Int 	
floatTimeSeconds - Int 	Float training time in seconds.
ifTimeSeconds - Int 	Instrumental flight seconds.
instructorSyntheticTrainingSeconds - Int 	
landingsDay - Int 	
landingsNight - Int 	
multiEngineIfrSeconds - Int 	
multiEngineVfrSeconds - Int 	
multiPilotSeconds - Int 	
nightSeconds - Int 	Flight time at night.
pilotInCommandSeconds - Int 	
singleEngineIfrSeconds - Int 	
singleEngineVfrSeconds - Int 	
syntheticTrainingSeconds - Int 	
totalSeconds - Int 	Total flight time.
Example

{
  "coPilotSeconds": 987,
  "daySeconds": 987,
  "dualSeconds": 987,
  "flightInstructorSeconds": 123,
  "floatTimeSeconds": 123,
  "ifTimeSeconds": 123,
  "instructorSyntheticTrainingSeconds": 123,
  "landingsDay": 123,
  "landingsNight": 123,
  "multiEngineIfrSeconds": 123,
  "multiEngineVfrSeconds": 123,
  "multiPilotSeconds": 123,
  "nightSeconds": 987,
  "pilotInCommandSeconds": 987,
  "singleEngineIfrSeconds": 987,
  "singleEngineVfrSeconds": 123,
  "syntheticTrainingSeconds": 123,
  "totalSeconds": 123
}

Types
Maintenance
Description

A Maintenance Part Type.
Fields
Field Name 	Description
audit - AuditInfo 	
createdAt - DateTime 	
disabled - Boolean 	
expiresOnCycles - Boolean! 	
expiresOnDate - Boolean! 	
expiresOnLog - FlightTimerEnum 	
name - String! 	
requireSerialNumber - Boolean 	
requireUploadOfDocument - Boolean 	
triggerOnLogTime - Boolean 	
updatedAt - DateTime 	
Example

{
  "audit": AuditInfo,
  "createdAt": "2007-12-03T10:15:30Z",
  "disabled": false,
  "expiresOnCycles": true,
  "expiresOnDate": false,
  "expiresOnLog": "AIRBORNE",
  "name": "abc123",
  "requireSerialNumber": true,
  "requireUploadOfDocument": false,
  "triggerOnLogTime": false,
  "updatedAt": "2007-12-03T10:15:30Z"
}

Types
MaintenanceBooking
Description

A booking for an aircraft maintenance.
Fields
Field Name 	Description
aircraft - Aircraft 	Will only be null if the requesting user is not allowed to read it.
arrivalAirport - Airport 	
audit - AuditInfo 	
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
departureAirport - Airport 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
flightEndsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
flightStartsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
id - String! 	
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
Example

{
  "aircraft": Aircraft,
  "arrivalAirport": Airport,
  "audit": AuditInfo,
  "color": "abc123",
  "comment": "abc123",
  "departureAirport": Airport,
  "emailNotifications": false,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "abc123",
  "flightEndsAt": "2007-12-03T10:15:30Z",
  "flightStartsAt": "2007-12-03T10:15:30Z",
  "id": "xyz789",
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED"
}

Types
MaintenanceBookingInput
Fields
Input Field 	Description
aircraftId - ID! 	
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
notifyViaEmail - Boolean 	
recurrenceRule - String 	
Example

{
  "aircraftId": 4,
  "awaitingApproval": true,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "color": "xyz789",
  "comment": "abc123",
  "externalReference": "abc123",
  "notifyViaEmail": false,
  "recurrenceRule": "abc123"
}

Types
MaintenanceConnection
Description

The connection type for Maintenance.
Fields
Field Name 	Description
edges - [MaintenanceEdge] 	A list of edges.
nodes - [Maintenance] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [MaintenanceEdge],
  "nodes": [Maintenance],
  "pageInfo": PageInfo
}

Types
MaintenanceEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Maintenance 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": Maintenance
}

Types
MaintenancePart
Description

A Maintenance Part Type.
Fields
Field Name 	Description
approvedAt - DateTime 	
approvedBy - User 	
audit - AuditInfo 	
expirationCycles - Int 	
expirationDate - DateTime 	
expirationLogSeconds - Int 	
expiresOnLog - FlightTimerEnum 	
id - Id! 	
maintenanceType - Maintenance 	Will only be null if the requesting user is not allowed to read it.
name - String! 	
plane - Aircraft 	Will only be null if the requesting user is not allowed to read it.
rejectedAt - DateTime 	
rejectedBy - User 	
serialNumber - String 	
status - MaintenancePartStatusEnum 	
Example

{
  "approvedAt": "2007-12-03T10:15:30Z",
  "approvedBy": User,
  "audit": AuditInfo,
  "expirationCycles": 123,
  "expirationDate": "2007-12-03T10:15:30Z",
  "expirationLogSeconds": 123,
  "expiresOnLog": "AIRBORNE",
  "id": Id,
  "maintenanceType": Maintenance,
  "name": "xyz789",
  "plane": Aircraft,
  "rejectedAt": "2007-12-03T10:15:30Z",
  "rejectedBy": User,
  "serialNumber": "xyz789",
  "status": "APPROVED"
}

Types
MaintenancePartConnection
Description

The connection type for MaintenancePart.
Fields
Field Name 	Description
edges - [MaintenancePartEdge] 	A list of edges.
nodes - [MaintenancePart] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [MaintenancePartEdge],
  "nodes": [MaintenancePart],
  "pageInfo": PageInfo
}

Types
MaintenancePartEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - MaintenancePart 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": MaintenancePart
}

Types
MaintenancePartInput
Description

Fields for a maintenance part. What you must send depends on how that maintenance item is set up in your organization (date, flight time, cycles, serial number, or attachments).
Fields
Input Field 	Description
description - String 	Free-text description.
expirationCycles - Int 	Needed when expiry is based on cycles (e.g. landings).
expirationDate - Date 	Needed when expiry is based on a calendar date.
expirationLogSeconds - Int 	Needed when expiry is based on aircraft flight time (as seconds).
expiresOnLog - FlightTimerEnum 	Which flight-time meter applies, when expiry is based on flight time.
previousMaintenancePartId - Id 	Earlier part this one replaces, if applicable.
referenceNo - String 	Your own reference or document number.
serialNumber - String 	Needed when that maintenance type expects a serial number.
Example

{
  "description": "xyz789",
  "expirationCycles": 123,
  "expirationDate": "2007-12-03",
  "expirationLogSeconds": 123,
  "expiresOnLog": "AIRBORNE",
  "previousMaintenancePartId": Id,
  "referenceNo": "abc123",
  "serialNumber": "abc123"
}

Types
MaintenancePartStatusEnum
Description

Maintenance Part Status Enum
Values
Enum Value 	Description

APPROVED
	

EXPIRED
	

TO_APPROVAL
	
Example

"APPROVED"

Types
MaintenanceWarning
Description

A maintenance warning
Fields
Field Name 	Description
audit - AuditInfo 	
color - String 	
cyclesLeft - Int 	
daysLeft - Int 	
expiryCycles - String 	
expiryDate - String 	
expiryTime - Int 	
hasDocument - Boolean! 	
id - Id! 	
logMeasurementType - String! 	
logType - String 	
requirers - [String!]! 	
serialNumber - String 	
status - String! 	
subjectName - String! 	
timeLeft - Float 	
typeOfTimer - String 	
typeOfTimerMeasurement - String! 	
Example

{
  "audit": AuditInfo,
  "color": "abc123",
  "cyclesLeft": 123,
  "daysLeft": 987,
  "expiryCycles": "abc123",
  "expiryDate": "xyz789",
  "expiryTime": 987,
  "hasDocument": true,
  "id": Id,
  "logMeasurementType": "abc123",
  "logType": "abc123",
  "requirers": ["abc123"],
  "serialNumber": "abc123",
  "status": "xyz789",
  "subjectName": "abc123",
  "timeLeft": 987.65,
  "typeOfTimer": "xyz789",
  "typeOfTimerMeasurement": "xyz789"
}

Types
MeetingBooking
Description

A booking for a meeting.
Fields
Field Name 	Description
audit - AuditInfo 	
classroom - Classroom 	The location (i.e. classroom) in which the booking will take place. Will only be null if the requesting user is not allowed to read it.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
id - String! 	
participants - [User]! 	
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
Example

{
  "audit": AuditInfo,
  "classroom": Classroom,
  "color": "abc123",
  "comment": "xyz789",
  "emailNotifications": false,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "abc123",
  "id": "abc123",
  "participants": [User],
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED"
}

Types
MeetingBookingInput
Fields
Input Field 	Description
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
classroomId - ID! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
notifyViaEmail - Boolean 	
participantsById - [ID]! 	
recurrenceRule - String 	
Example

{
  "awaitingApproval": true,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "classroomId": "4",
  "color": "xyz789",
  "comment": "xyz789",
  "externalReference": "abc123",
  "notifyViaEmail": true,
  "participantsById": [4],
  "recurrenceRule": "abc123"
}

Types
MemberAttachment
Fields
Field Name 	Description
audit - AuditInfo 	
fileName - String! 	The name of the underlying file.
fileType - String 	The file type of the underlying file.
fileUrl - String 	Address used to retrieve the underlying file.
id - String! 	
Example

{
  "audit": AuditInfo,
  "fileName": "abc123",
  "fileType": "xyz789",
  "fileUrl": "abc123",
  "id": "abc123"
}

Types
MultiStudentBooking
Description

A booking for a multi-student training flight.
Fields
Field Name 	Description
aircraft - Aircraft 	Will only be null if the requesting user is not allowed to read it.
arrivalAirport - Airport 	
audit - AuditInfo 	
cancellations - [BookingCancellation] 	The cancellation registration associated with the booking.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
departureAirport - Airport 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
flightEndsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
flightStartsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
id - String! 	
instructor - User 	Will only be null if the requesting user is not allowed to read it.
observers - [User]! 	
plannedLessons - [Training] 	The planned training lessons associated with the booking.
registrations - [Training] 	The training registrations associated with the booking.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
students - [User]! 	
Example

{
  "aircraft": Aircraft,
  "arrivalAirport": Airport,
  "audit": AuditInfo,
  "cancellations": [BookingCancellation],
  "color": "abc123",
  "comment": "xyz789",
  "departureAirport": Airport,
  "emailNotifications": true,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "abc123",
  "flightEndsAt": "2007-12-03T10:15:30Z",
  "flightStartsAt": "2007-12-03T10:15:30Z",
  "id": "xyz789",
  "instructor": User,
  "observers": [User],
  "plannedLessons": [Training],
  "registrations": [Training],
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED",
  "students": [User]
}

Types
MultiStudentBookingInput
Fields
Input Field 	Description
aircraftId - ID! 	
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
flightEnd - DateTime! 	
flightStart - DateTime! 	
instructorById - ID! 	
notifyViaEmail - Boolean 	
observersById - [ID] 	
recurrenceRule - String 	
studentsById - [StudentInput!]! 	
Example

{
  "aircraftId": "4",
  "awaitingApproval": false,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "color": "abc123",
  "comment": "xyz789",
  "externalReference": "xyz789",
  "flightEnd": "2007-12-03T10:15:30Z",
  "flightStart": "2007-12-03T10:15:30Z",
  "instructorById": "4",
  "notifyViaEmail": true,
  "observersById": [4],
  "recurrenceRule": "xyz789",
  "studentsById": [StudentInput]
}

Types
MyFlightLogger
Description

A myFlightLogger account
Fields
Field Name 	Description
avatarUrl - String! 	
callSign - String! 	
email - String! 	
firstName - String! 	
lastName - String! 	
logbookEntries - LogbookConnection 	Get logbooks within a time frame.
Arguments
after - String

Returns the elements in the list that come after the specified cursor.
before - String

Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime

If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int

Returns the first n elements from the list.
from - DateTime

If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int

Returns the last n elements from the list.
sortBy - LogbookSorter
sortDesc - Boolean
to - DateTime

If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
logbookSummations - LogbookSummation 	Get summaries of logbook within a time frame.
Arguments
changedAfter - DateTime

If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
from - DateTime

If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
to - DateTime

If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
Example

{
  "avatarUrl": "xyz789",
  "callSign": "abc123",
  "email": "xyz789",
  "firstName": "xyz789",
  "lastName": "abc123",
  "logbookEntries": LogbookConnection,
  "logbookSummations": LogbookSummation
}

Types
MyFlightLoggerEntry
Description

A myFlightLogger account collection for entries
Fields
Field Name 	Description
createBulkLogbookEntry - Logbook! 	Create a manual bulk logbook entry.
Arguments
input - BulkLogbookEntryInput!
createLogbookEntry - Logbook! 	Create a manual logbook entry.
Arguments
input - LogbookEntryInput!
createSimLogbookEntry - Logbook! 	Create a manual logbook entry.
Arguments
input - SimLogbookEntryInput!
destroyLogbookEntry - Boolean! 	Destroy a manual logbook entry.
Arguments
id - ID!
generateReport - String! 	Initiate generation of a report
Arguments
endsAt - Date
exportType - ExportTypeEnum!
reportType - ReportTypeEnum!
startsAt - Date
updateBulkLogbookEntry - Logbook! 	Update a manual bulk logbook entry.
Arguments
input - BulkLogbookEntryInput!
updateLogbookEntry - Logbook! 	Updates a manual logbook entry.
Arguments
input - LogbookEntryInput!
updateSimLogbookEntry - Logbook! 	Updates a manual logbook entry.
Arguments
input - SimLogbookEntryInput!
Example

{
  "createBulkLogbookEntry": Logbook,
  "createLogbookEntry": Logbook,
  "createSimLogbookEntry": Logbook,
  "destroyLogbookEntry": false,
  "generateReport": "abc123",
  "updateBulkLogbookEntry": Logbook,
  "updateLogbookEntry": Logbook,
  "updateSimLogbookEntry": Logbook
}

Types
Operation
Description

An operation registration.
Fields
Field Name 	Description
asymmetricSeconds - Int! 	
audit - AuditInfo 	
booking - OperationBooking 	
comment - String 	
crew - [User]! 	Entries will only be null if the requesting user is not allowed to read them.
crossCountrySeconds - Int! 	
customer - Customer 	
expensesInvoiceNumber - String 	
flights - [Flight]! 	
floatSeconds - Int! 	
id - Id! 	
ifrDualSeconds - Int! 	
ifrSimSeconds - Int! 	
ifrSpicSeconds - Int! 	
incomeInvoiceNumber - String 	
instrumentSeconds - Int! 	
multiSeconds - Int! 	
nightSeconds - Int! 	
operationType - OperationType 	The type of operation performed.
pic - User 	Will only be null if the requesting user is not allowed to read it.
pilotFlyingSeconds - Int! 	
pilotMonitoringSeconds - Int! 	
singleSeconds - Int! 	
totalSeconds - Int! 	
vfrDualSeconds - Int! 	
vfrSimSeconds - Int! 	
vfrSoloSeconds - Int! 	
vfrSpicSeconds - Int! 	
Example

{
  "asymmetricSeconds": 987,
  "audit": AuditInfo,
  "booking": OperationBooking,
  "comment": "abc123",
  "crew": [User],
  "crossCountrySeconds": 123,
  "customer": Customer,
  "expensesInvoiceNumber": "abc123",
  "flights": [Flight],
  "floatSeconds": 987,
  "id": Id,
  "ifrDualSeconds": 987,
  "ifrSimSeconds": 987,
  "ifrSpicSeconds": 987,
  "incomeInvoiceNumber": "abc123",
  "instrumentSeconds": 123,
  "multiSeconds": 987,
  "nightSeconds": 987,
  "operationType": OperationType,
  "pic": User,
  "pilotFlyingSeconds": 123,
  "pilotMonitoringSeconds": 987,
  "singleSeconds": 987,
  "totalSeconds": 987,
  "vfrDualSeconds": 123,
  "vfrSimSeconds": 987,
  "vfrSoloSeconds": 123,
  "vfrSpicSeconds": 987
}

Types
OperationBooking
Description

A booking for an operation flight.
Fields
Field Name 	Description
aircraft - Aircraft 	Will only be null if the requesting user is not allowed to read it.
arrivalAirport - Airport 	
audit - AuditInfo 	
cancellation - BookingCancellation 	The cancellation registration associated with the booking.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
crew - [User]! 	Attending crew.
customer - Customer 	
departureAirport - Airport 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
flightEndsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
flightStartsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
id - String! 	
operationType - OperationType 	The type of operation that has been slated to be flown. Will only be null if the requesting user is not allowed to read it.
pic - User 	Pilot in Command. Will only be null if the requesting user is not allowed to read it.
registration - Operation 	The operation registration associated with the booking.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
Example

{
  "aircraft": Aircraft,
  "arrivalAirport": Airport,
  "audit": AuditInfo,
  "cancellation": BookingCancellation,
  "color": "xyz789",
  "comment": "abc123",
  "crew": [User],
  "customer": Customer,
  "departureAirport": Airport,
  "emailNotifications": true,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "abc123",
  "flightEndsAt": "2007-12-03T10:15:30Z",
  "flightStartsAt": "2007-12-03T10:15:30Z",
  "id": "abc123",
  "operationType": OperationType,
  "pic": User,
  "registration": Operation,
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED"
}

Types
OperationBookingInput
Fields
Input Field 	Description
aircraftId - ID! 	
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
color - String 	
comment - String 	
crewsById - [ID] 	
customerById - ID 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
flightEnd - DateTime! 	
flightStart - DateTime! 	
notifyViaEmail - Boolean 	
operationId - ID! 	
picById - ID! 	
recurrenceRule - String 	
Example

{
  "aircraftId": "4",
  "awaitingApproval": false,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "color": "abc123",
  "comment": "xyz789",
  "crewsById": ["4"],
  "customerById": 4,
  "externalReference": "abc123",
  "flightEnd": "2007-12-03T10:15:30Z",
  "flightStart": "2007-12-03T10:15:30Z",
  "notifyViaEmail": true,
  "operationId": 4,
  "picById": "4",
  "recurrenceRule": "abc123"
}

Types
OperationConnection
Description

The connection type for Operation.
Fields
Field Name 	Description
edges - [OperationEdge] 	A list of edges.
nodes - [Operation] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [OperationEdge],
  "nodes": [Operation],
  "pageInfo": PageInfo
}

Types
OperationEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Operation 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": Operation
}

Types
OperationType
Description

An operation type. To indicate the type of operation being flown as part of an operation registration.
Fields
Field Name 	Description
audit - AuditInfo 	
externalReference - String 	Used to identify/reference this specific operation type outside of FlightLogger.
id - String! 	
name - String! 	
note - String! 	
Example

{
  "audit": AuditInfo,
  "externalReference": "xyz789",
  "id": "abc123",
  "name": "xyz789",
  "note": "abc123"
}

Types
PageInfo
Description

Information about pagination in a connection.
Fields
Field Name 	Description
endCursor - String 	When paginating forwards, the cursor to continue.
hasNextPage - Boolean! 	When paginating forwards, are there more items?
hasPreviousPage - Boolean! 	When paginating backwards, are there more items?
startCursor - String 	When paginating backwards, the cursor to continue.
Example

{
  "endCursor": "abc123",
  "hasNextPage": true,
  "hasPreviousPage": false,
  "startCursor": "xyz789"
}

Types
PmfTypeEnum
Description

PMF (Pilot Monitoring/Flying) state.
Values
Enum Value 	Description

PILOT_FLYING
	

PILOT_MONITORING
	

PILOT_NOT_SPECIFIED
	
Example

"PILOT_FLYING"

Types
PresignedUrls
Fields
Field Name 	Description
signedGetUrl - String 	
signedPutUrl - String 	
Example

{
  "signedGetUrl": "xyz789",
  "signedPutUrl": "xyz789"
}

Types
Program
Description

A program. Not to be confused with a UserProgram, which represents the link between a program and user.
Fields
Field Name 	Description
aircraftType - ProgramAircraftTypeEnum 	Programs define what kind of aircraft is used
audit - AuditInfo 	
cbtaEnabled - Boolean! 	Whether the program's active revision has CBTA enabled
externalReference - String 	Used to identify/reference this specific operation type outside of FlightLogger.
id - Id! 	
name - String! 	
programRevisions - ProgramRevisionConnection! 	Revisions of this program
Arguments
after - String

Returns the elements in the list that come after the specified cursor.
before - String

Returns the elements in the list that come before the specified cursor.
first - Int

Returns the first n elements from the list.
last - Int

Returns the last n elements from the list.
programType - ProgramTypeEnum 	Programs are split into either flight or ground training
Example

{
  "aircraftType": "AIRPLANE",
  "audit": AuditInfo,
  "cbtaEnabled": true,
  "externalReference": "xyz789",
  "id": Id,
  "name": "xyz789",
  "programRevisions": ProgramRevisionConnection,
  "programType": "COMBINED_SYLLABUS"
}

Types
ProgramAircraftTypeEnum
Description

Aircraft for the program
Values
Enum Value 	Description

AIRPLANE
	

HELICOPTER
	
Example

"AIRPLANE"

Types
ProgramConnection
Description

The connection type for Program.
Fields
Field Name 	Description
edges - [ProgramEdge] 	A list of edges.
nodes - [Program] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [ProgramEdge],
  "nodes": [Program],
  "pageInfo": PageInfo
}

Types
ProgramEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Program 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": Program
}

Types
ProgramPhase
Description

A program phase.
Fields
Field Name 	Description
audit - AuditInfo 	
id - Id! 	
lectures - [Lecture] 	
name - String! 	
Example

{
  "audit": AuditInfo,
  "id": Id,
  "lectures": [Lecture],
  "name": "xyz789"
}

Types
ProgramRevision
Description

A program revision.
Fields
Field Name 	Description
audit - AuditInfo 	
externalReference - String 	Used to identify/reference this specific operation type outside of FlightLogger.
id - Id! 	
modernTheoryProgram - Boolean 	
name - String! 	
programPhases - [ProgramPhase] 	
Example

{
  "audit": AuditInfo,
  "externalReference": "xyz789",
  "id": Id,
  "modernTheoryProgram": true,
  "name": "abc123",
  "programPhases": [ProgramPhase]
}

Types
ProgramRevisionConnection
Description

The connection type for ProgramRevision.
Fields
Field Name 	Description
edges - [ProgramRevisionEdge] 	A list of edges.
nodes - [ProgramRevision] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [ProgramRevisionEdge],
  "nodes": [ProgramRevision],
  "pageInfo": PageInfo
}

Types
ProgramRevisionEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - ProgramRevision 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": ProgramRevision
}

Types
ProgramTypeEnum
Description

Program type
Values
Enum Value 	Description

COMBINED_SYLLABUS
	

FLIGHT_TRAINING
	

GROUND_TRAINING
	
Example

"COMBINED_SYLLABUS"

Types
ProgressTest
Description

A progress test registration.
Fields
Field Name 	Description
attachments - [Attachment] 	
audit - AuditInfo 	
booking - ProgressTestBooking 	
class - Class 	
comment - String 	
endsAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
expensesInvoiceNumber - String 	Only present if an expense invoice is filled.
groundTrainingSubject - SubjectCategory 	Will only be null if the requesting user is not allowed to read it.
id - String! 	
instructor - User 	Will only be null if the requesting user is not allowed to read.
note - String 	
participations - [TheoryParticipation]! 	
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
subject - String 	Renamed to note
subjectCategory - SubjectCategory 	Will only be null if the requesting user is not allowed to read it. Renamed to groundTrainingSubject
Example

{
  "attachments": [Attachment],
  "audit": AuditInfo,
  "booking": ProgressTestBooking,
  "class": Class,
  "comment": "xyz789",
  "endsAt": "2007-12-03T10:15:30Z",
  "expensesInvoiceNumber": "abc123",
  "groundTrainingSubject": SubjectCategory,
  "id": "abc123",
  "instructor": User,
  "note": "xyz789",
  "participations": [TheoryParticipation],
  "startsAt": "2007-12-03T10:15:30Z",
  "subject": "abc123",
  "subjectCategory": SubjectCategory
}

Types
ProgressTestBooking
Description

A booking for a progress test.
Fields
Field Name 	Description
audit - AuditInfo 	
class - Class 	
classroom - Classroom 	The location (i.e. classroom) in which the booking will take place. Will only be null if the requesting user is not allowed to read it.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
id - String! 	
instructor - User 	The instructor/examiner slated to oversee the booking. Will only be null if the requesting user is not allowed to read it.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
students - [User]! 	Students slated to participate in the activity.
subject - String 	The subject or name of the theoretical activity.
theoryCourse - TheoryCourse 	Will only be null if the requesting user is not allowed to read it.
Example

{
  "audit": AuditInfo,
  "class": Class,
  "classroom": Classroom,
  "color": "xyz789",
  "comment": "xyz789",
  "emailNotifications": true,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "xyz789",
  "id": "abc123",
  "instructor": User,
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED",
  "students": [User],
  "subject": "xyz789",
  "theoryCourse": TheoryCourse
}

Types
ProgressTestBookingInput
Fields
Input Field 	Description
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
classroomId - ID! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
instructorById - ID! 	
notifyViaEmail - Boolean 	
programId - ID 	
programRevisionId - ID 	
recurrenceRule - String 	
studentsById - [StudentInput!] 	
subject - String 	
subjectCategoryId - ID! 	
teamId - ID 	
theoryCourse - ID 	
theoryLessonId - ID 	
Example

{
  "awaitingApproval": false,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "classroomId": 4,
  "color": "xyz789",
  "comment": "xyz789",
  "externalReference": "abc123",
  "instructorById": 4,
  "notifyViaEmail": true,
  "programId": 4,
  "programRevisionId": "4",
  "recurrenceRule": "xyz789",
  "studentsById": [StudentInput],
  "subject": "abc123",
  "subjectCategoryId": 4,
  "teamId": "4",
  "theoryCourse": "4",
  "theoryLessonId": 4
}

Types
ProgressTestConnection
Description

The connection type for ProgressTest.
Fields
Field Name 	Description
edges - [ProgressTestEdge] 	A list of edges.
nodes - [ProgressTest] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [ProgressTestEdge],
  "nodes": [ProgressTest],
  "pageInfo": PageInfo
}

Types
ProgressTestEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - ProgressTest 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": ProgressTest
}

Types
RecurrentBookingUpdateMethodEnum
Values
Enum Value 	Description

all
	

onlyThis
	

thisAndAllFuture
	
Example

"all"

Types
Rental
Description

A rental flight registration.
Fields
Field Name 	Description
asymmetricSeconds - Int! 	
audit - AuditInfo 	
booking - RentalBooking 	
comment - String 	
crossCountrySeconds - Int! 	
flights - [Flight]! 	
floatSeconds - Int! 	
id - Id! 	
ifrDualSeconds - Int! 	
ifrSimSeconds - Int! 	
ifrSpicSeconds - Int! 	
instrumentSeconds - Int! 	
multiSeconds - Int! 	
nightSeconds - Int! 	
pilotFlyingSeconds - Int! 	
pilotMonitoringSeconds - Int! 	
renter - User 	Will only be null if the requesting user is not allowed to read it.
singleSeconds - Int! 	
totalSeconds - Int! 	
vfrDualSeconds - Int! 	
vfrSimSeconds - Int! 	
vfrSoloSeconds - Int! 	
vfrSpicSeconds - Int! 	
Example

{
  "asymmetricSeconds": 123,
  "audit": AuditInfo,
  "booking": RentalBooking,
  "comment": "abc123",
  "crossCountrySeconds": 987,
  "flights": [Flight],
  "floatSeconds": 987,
  "id": Id,
  "ifrDualSeconds": 123,
  "ifrSimSeconds": 123,
  "ifrSpicSeconds": 987,
  "instrumentSeconds": 123,
  "multiSeconds": 987,
  "nightSeconds": 123,
  "pilotFlyingSeconds": 123,
  "pilotMonitoringSeconds": 987,
  "renter": User,
  "singleSeconds": 123,
  "totalSeconds": 123,
  "vfrDualSeconds": 987,
  "vfrSimSeconds": 987,
  "vfrSoloSeconds": 987,
  "vfrSpicSeconds": 987
}

Types
RentalBooking
Description

A booking for a rental flight.
Fields
Field Name 	Description
aircraft - Aircraft 	Will only be null if the requesting user is not allowed to read it.
approved - Boolean! 	True if the rental request has been approved by a rental administrator. False otherwise.
arrivalAirport - Airport 	
audit - AuditInfo 	
cancellation - BookingCancellation 	The cancellation registration associated with the booking.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
departureAirport - Airport 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
flightEndsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
flightStartsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
id - String! 	
registration - Rental 	The rental registration associated with the booking.
renter - User 	Will only be null if the requesting user is not allowed to read it.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
Example

{
  "aircraft": Aircraft,
  "approved": false,
  "arrivalAirport": Airport,
  "audit": AuditInfo,
  "cancellation": BookingCancellation,
  "color": "abc123",
  "comment": "xyz789",
  "departureAirport": Airport,
  "emailNotifications": false,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "abc123",
  "flightEndsAt": "2007-12-03T10:15:30Z",
  "flightStartsAt": "2007-12-03T10:15:30Z",
  "id": "abc123",
  "registration": Rental,
  "renter": User,
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED"
}

Types
RentalBookingInput
Fields
Input Field 	Description
aircraftId - ID! 	
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
notifyViaEmail - Boolean 	
recurrenceRule - String 	
renterById - ID! 	
Example

{
  "aircraftId": 4,
  "awaitingApproval": true,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "color": "xyz789",
  "comment": "abc123",
  "externalReference": "abc123",
  "notifyViaEmail": true,
  "recurrenceRule": "abc123",
  "renterById": "4"
}

Types
RentalConnection
Description

The connection type for Rental.
Fields
Field Name 	Description
edges - [RentalEdge] 	A list of edges.
nodes - [Rental] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [RentalEdge],
  "nodes": [Rental],
  "pageInfo": PageInfo
}

Types
RentalEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Rental 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": Rental
}

Types
ReportTypeEnum
Description

Reports available for export
Values
Enum Value 	Description

MY_LOGBOOK
	
Example

"MY_LOGBOOK"

Types
ServiceSummary
Description

A service summary
Fields
Field Name 	Description
cyclesWarningColor - String 	
dateWarningColor - String 	
nextPrimaryService - Float 	
nextSecondaryService - Float 	
nextServiceCycles - Float 	
nextServiceDate - String 	
nextTertiaryService - Float 	
primaryWarningColor - String 	
secondaryWarningColor - String 	
tertiaryWarningColor - String 	
Example

{
  "cyclesWarningColor": "xyz789",
  "dateWarningColor": "abc123",
  "nextPrimaryService": 123.45,
  "nextSecondaryService": 123.45,
  "nextServiceCycles": 987.65,
  "nextServiceDate": "abc123",
  "nextTertiaryService": 987.65,
  "primaryWarningColor": "abc123",
  "secondaryWarningColor": "abc123",
  "tertiaryWarningColor": "abc123"
}

Types
SimLogbookEntryInput
Fields
Input Field 	Description
id - ID 	
instructorSyntheticTrainingSeconds - Int 	
offBlock - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
onBlock - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
registration - String! 	
remarksAndEndorsements - String 	
syntheticTrainingSeconds - Int! 	
typeOfAircraft - String! 	
Example

{
  "id": 4,
  "instructorSyntheticTrainingSeconds": 987,
  "offBlock": "2007-12-03T10:15:30Z",
  "onBlock": "2007-12-03T10:15:30Z",
  "registration": "abc123",
  "remarksAndEndorsements": "abc123",
  "syntheticTrainingSeconds": 123,
  "typeOfAircraft": "xyz789"
}

Types
SingleStudentBooking
Description

A booking for a single-student training.
Fields
Field Name 	Description
aircraft - Aircraft 	Will only be null if the requesting user is not allowed to read it.
arrivalAirport - Airport 	
audit - AuditInfo 	
cancellation - BookingCancellation 	The cancellation registration associated with the booking.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
departureAirport - Airport 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
flightEndsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
flightStartsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
id - String! 	
instructor - User 	Will only be null if the requesting user is not allowed to read it.
observers - [User]! 	
plannedLesson - Training 	The planned training lesson associated with the booking.
registration - Training 	The training registration associated with the booking.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
student - User 	Will only be null if the requesting user is not allowed to read it.
Example

{
  "aircraft": Aircraft,
  "arrivalAirport": Airport,
  "audit": AuditInfo,
  "cancellation": BookingCancellation,
  "color": "abc123",
  "comment": "abc123",
  "departureAirport": Airport,
  "emailNotifications": false,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "xyz789",
  "flightEndsAt": "2007-12-03T10:15:30Z",
  "flightStartsAt": "2007-12-03T10:15:30Z",
  "id": "abc123",
  "instructor": User,
  "observers": [User],
  "plannedLesson": Training,
  "registration": Training,
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED",
  "student": User
}

Types
SingleStudentBookingInput
Fields
Input Field 	Description
aircraftId - ID! 	
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
flightEnd - DateTime! 	
flightStart - DateTime! 	
instructorById - ID! 	
notifyViaEmail - Boolean 	
observersById - [ID] 	
recurrenceRule - String 	
studentById - StudentInput! 	
Example

{
  "aircraftId": 4,
  "awaitingApproval": true,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "color": "xyz789",
  "comment": "xyz789",
  "externalReference": "abc123",
  "flightEnd": "2007-12-03T10:15:30Z",
  "flightStart": "2007-12-03T10:15:30Z",
  "instructorById": 4,
  "notifyViaEmail": true,
  "observersById": [4],
  "recurrenceRule": "abc123",
  "studentById": StudentInput
}

Types
Sitting
Description

An exam sitting.
Fields
Field Name 	Description
audit - AuditInfo 	
endsAt - Date! 	Expects a date to be specified in ISO 8610 format.
id - Id! 	
sittingNumber - Int! 	
startsAt - Date! 	Expects a date to be specified in ISO 8610 format.
Example

{
  "audit": AuditInfo,
  "endsAt": "2007-12-03",
  "id": Id,
  "sittingNumber": 123,
  "startsAt": "2007-12-03"
}

Types
String
Description

The String scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
Example

"abc123"

Types
StudentInput
Fields
Input Field 	Description
userId - ID! 	
userLectureId - ID 	
Example

{
  "userId": "4",
  "userLectureId": "4"
}

Types
SubjectCategory
Description

A subject category as part of a theory course.
Fields
Field Name 	Description
audit - AuditInfo 	
id - Id! 	
name - String 	
theoryCourse - TheoryCourse 	Will only be null if the requesting user is not allowed to read it.
totalSeconds - Int 	Minimum required classroom hours (in seconds) for this subject category.
Example

{
  "audit": AuditInfo,
  "id": Id,
  "name": "abc123",
  "theoryCourse": TheoryCourse,
  "totalSeconds": 123
}

Types
SubjectCategoryConnection
Description

The connection type for SubjectCategory.
Fields
Field Name 	Description
edges - [SubjectCategoryEdge] 	A list of edges.
nodes - [SubjectCategory] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [SubjectCategoryEdge],
  "nodes": [SubjectCategory],
  "pageInfo": PageInfo
}

Types
SubjectCategoryEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - SubjectCategory 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": SubjectCategory
}

Types
Theory
Description

A theory registration with one or more students.
Fields
Field Name 	Description
attachments - [Attachment] 	
booking - GroundBooking 	
class - Class 	
endsAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
groundTrainingSubject - SubjectCategory 	Will only be null if the requesting user is not allowed to read it.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
subjectCategory - SubjectCategory 	Will only be null if the requesting user is not allowed to read it. Renamed to groundTrainingSubject
Possible Types
Theory Types

ClassTheory

Exam

ProgressTest

TheoryRelease

TypeQuestionnaire
Example

{
  "attachments": [Attachment],
  "booking": GroundBooking,
  "class": Class,
  "endsAt": "2007-12-03T10:15:30Z",
  "groundTrainingSubject": SubjectCategory,
  "startsAt": "2007-12-03T10:15:30Z",
  "subjectCategory": SubjectCategory
}

Types
TheoryBooking
Description

Fields common to all theoretical booking.
Fields
Field Name 	Description
class - Class 	
instructor - User 	The instructor/examiner slated to oversee the booking. Will only be null if the requesting user is not allowed to read it.
students - [User]! 	Students slated to participate in the activity.
subject - String 	The subject or name of the theoretical activity.
theoryCourse - TheoryCourse 	Will only be null if the requesting user is not allowed to read it.
Possible Types
TheoryBooking Types

ClassTheoryBooking

ExamBooking

ProgressTestBooking

TheoryReleaseBooking

TypeQuestionnaireBooking
Example

{
  "class": Class,
  "instructor": User,
  "students": [User],
  "subject": "xyz789",
  "theoryCourse": TheoryCourse
}

Types
TheoryCourse
Description

A theory course.
Fields
Field Name 	Description
audit - AuditInfo 	
disabled - Boolean! 	
id - String! 	
name - String! 	
Example

{
  "audit": AuditInfo,
  "disabled": true,
  "id": "xyz789",
  "name": "xyz789"
}

Types
TheoryLessonBookingSubtypeEnum
Description

Theory-related booking subtypes that support selecting a theory lesson.
Values
Enum Value 	Description

CLASS_THEORY
	

EXAM
	

PROGRESS_TEST
	

THEORY_RELEASE
	

TYPE_QUESTIONNAIRE
	
Example

"CLASS_THEORY"

Types
TheoryLessonOption
Description

A theory lesson option that can be used when creating or editing theory-related bookings.
Fields
Field Name 	Description
durationSeconds - Int 	The lesson duration in seconds, when available.
id - Id! 	The theory lesson id.
name - String! 	The display name of the theory lesson option.
registeredStudentIds - [Id!]! 	Selected students already registered for this lesson.
Example

{
  "durationSeconds": 987,
  "id": Id,
  "name": "abc123",
  "registeredStudentIds": [Id]
}

Types
TheoryLessonOptionConnection
Description

The connection type for TheoryLessonOption.
Fields
Field Name 	Description
edges - [TheoryLessonOptionEdge] 	A list of edges.
nodes - [TheoryLessonOption] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [TheoryLessonOptionEdge],
  "nodes": [TheoryLessonOption],
  "pageInfo": PageInfo
}

Types
TheoryLessonOptionEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - TheoryLessonOption 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": TheoryLessonOption
}

Types
TheoryParticipation
Description

Represents a students participation in a type of theory.
Fields
Field Name 	Description
attendanceStatus - AttendanceStatusEnum! 	
attendedSeconds - Int 	Actual attended classroom hours (in seconds) for this participation. Zero if did_not_attend.
audit - AuditInfo 	
endsAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
grade - String 	The grade given to the participant. Not applicable to class theories.
id - String! 	
incomeInvoiceNumber - String 	Only present if an income invoice is filled.
startsAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
studentComment - String 	Comment given by the student. Not applicable to exams.
user - User 	
Example

{
  "attendanceStatus": "ATTENDED",
  "attendedSeconds": 123,
  "audit": AuditInfo,
  "endsAt": "2007-12-03T10:15:30Z",
  "grade": "xyz789",
  "id": "xyz789",
  "incomeInvoiceNumber": "abc123",
  "startsAt": "2007-12-03T10:15:30Z",
  "studentComment": "xyz789",
  "user": User
}

Types
TheoryRelease
Description

A theory release registration.
Fields
Field Name 	Description
attachments - [Attachment] 	
audit - AuditInfo 	
booking - TheoryReleaseBooking 	
class - Class 	
comment - String 	
endsAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
expensesInvoiceNumber - String 	Only present if an expense invoice is filled.
groundTrainingSubject - SubjectCategory 	Will only be null if the requesting user is not allowed to read it.
id - Id! 	
instructor - User 	Will only be null if the requesting user is not allowed to read.
note - String 	
participations - [TheoryParticipation]! 	
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
subject - String 	Renamed to note
subjectCategory - SubjectCategory 	Will only be null if the requesting user is not allowed to read it. Renamed to groundTrainingSubject
Example

{
  "attachments": [Attachment],
  "audit": AuditInfo,
  "booking": TheoryReleaseBooking,
  "class": Class,
  "comment": "xyz789",
  "endsAt": "2007-12-03T10:15:30Z",
  "expensesInvoiceNumber": "abc123",
  "groundTrainingSubject": SubjectCategory,
  "id": Id,
  "instructor": User,
  "note": "abc123",
  "participations": [TheoryParticipation],
  "startsAt": "2007-12-03T10:15:30Z",
  "subject": "xyz789",
  "subjectCategory": SubjectCategory
}

Types
TheoryReleaseBooking
Description

A booking for a theory release.
Fields
Field Name 	Description
audit - AuditInfo 	
class - Class 	
classroom - Classroom 	The location (i.e. classroom) in which the booking will take place. Will only be null if the requesting user is not allowed to read it.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
id - String! 	
instructor - User 	The instructor/examiner slated to oversee the booking. Will only be null if the requesting user is not allowed to read it.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
students - [User]! 	Students slated to participate in the activity.
subject - String 	The subject or name of the theoretical activity.
theoryCourse - TheoryCourse 	Will only be null if the requesting user is not allowed to read it.
Example

{
  "audit": AuditInfo,
  "class": Class,
  "classroom": Classroom,
  "color": "xyz789",
  "comment": "xyz789",
  "emailNotifications": false,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "abc123",
  "id": "xyz789",
  "instructor": User,
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED",
  "students": [User],
  "subject": "xyz789",
  "theoryCourse": TheoryCourse
}

Types
TheoryReleaseBookingInput
Fields
Input Field 	Description
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
classroomId - ID! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
instructorById - ID! 	
notifyViaEmail - Boolean 	
programId - ID 	
programRevisionId - ID 	
recurrenceRule - String 	
studentsById - [StudentInput!] 	
subject - String 	
subjectCategoryId - ID! 	
teamId - ID 	
theoryCourse - ID 	
theoryLessonId - ID 	
Example

{
  "awaitingApproval": false,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "classroomId": 4,
  "color": "abc123",
  "comment": "xyz789",
  "externalReference": "abc123",
  "instructorById": 4,
  "notifyViaEmail": false,
  "programId": 4,
  "programRevisionId": "4",
  "recurrenceRule": "xyz789",
  "studentsById": [StudentInput],
  "subject": "abc123",
  "subjectCategoryId": 4,
  "teamId": 4,
  "theoryCourse": "4",
  "theoryLessonId": "4"
}

Types
TheoryReleaseConnection
Description

The connection type for TheoryRelease.
Fields
Field Name 	Description
edges - [TheoryReleaseEdge] 	A list of edges.
nodes - [TheoryRelease] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [TheoryReleaseEdge],
  "nodes": [TheoryRelease],
  "pageInfo": PageInfo
}

Types
TheoryReleaseEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - TheoryRelease 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": TheoryRelease
}

Types
Training
Description

A training registration. Represents a completed Lecture. Not to be confused with a Lecture itself.
Fields
Field Name 	Description
approvedByStudent - Boolean! 	
approvedByStudentAt - DateTime 	
asymmetricSeconds - Int! 	
audit - AuditInfo 	
booking - TrainingBookingUnion 	
briefingSeconds - Int! 	The duration of the briefing, in seconds.
comment - String 	
crossCountrySeconds - Int! 	
debriefingSeconds - Int! 	The duration of the de-briefing, in seconds.
failedPerformance - Boolean 	Whether the failure is performance-related. Only present when status is FAILED.
flights - [Flight]! 	
floatSeconds - Int! 	
id - Id! 	
ifrDualSeconds - Int! 	
ifrSimSeconds - Int! 	
ifrSpicSeconds - Int! 	
instructor - User 	The instructor performing the training. Note that if status is NOT_FLOWN or CREDITED, instructor may be null.
instrumentSeconds - Int! 	
lecture - Lecture 	
multiSeconds - Int! 	
name - String! 	
nightSeconds - Int! 	
pilotFlyingSeconds - Int! 	
pilotMonitoringSeconds - Int! 	
singleSeconds - Int! 	
status - TrainingStatusEnum! 	
student - User 	
submittedByInstructorAt - DateTime 	
totalSeconds - Int! 	
userCategories - [UserCategory] 	
userProgram - UserProgram 	
vfrDualSeconds - Int! 	
vfrSimSeconds - Int! 	
vfrSoloSeconds - Int! 	
vfrSpicSeconds - Int! 	
Example

{
  "approvedByStudent": true,
  "approvedByStudentAt": "2007-12-03T10:15:30Z",
  "asymmetricSeconds": 987,
  "audit": AuditInfo,
  "booking": MultiStudentBooking,
  "briefingSeconds": 123,
  "comment": "abc123",
  "crossCountrySeconds": 123,
  "debriefingSeconds": 987,
  "failedPerformance": false,
  "flights": [Flight],
  "floatSeconds": 987,
  "id": Id,
  "ifrDualSeconds": 123,
  "ifrSimSeconds": 123,
  "ifrSpicSeconds": 123,
  "instructor": User,
  "instrumentSeconds": 987,
  "lecture": Lecture,
  "multiSeconds": 123,
  "name": "xyz789",
  "nightSeconds": 123,
  "pilotFlyingSeconds": 123,
  "pilotMonitoringSeconds": 123,
  "singleSeconds": 987,
  "status": "CREDITED",
  "student": User,
  "submittedByInstructorAt": "2007-12-03T10:15:30Z",
  "totalSeconds": 123,
  "userCategories": [UserCategory],
  "userProgram": UserProgram,
  "vfrDualSeconds": 123,
  "vfrSimSeconds": 987,
  "vfrSoloSeconds": 123,
  "vfrSpicSeconds": 987
}

Types
TrainingBookingUnion
Description

All training booking subtypes.
Types
Union Types

MultiStudentBooking

SingleStudentBooking
Example

MultiStudentBooking

Types
TrainingConnection
Description

The connection type for Training.
Fields
Field Name 	Description
edges - [TrainingEdge] 	A list of edges.
nodes - [Training] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [TrainingEdge],
  "nodes": [Training],
  "pageInfo": PageInfo
}

Types
TrainingEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - Training 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": Training
}

Types
TrainingStatusEnum
Description

The current state of a training registrations' lifecycle.
Values
Enum Value 	Description

CREDITED
	

FAILED
	

NOT_FLOWN
	

PARTIALLY_COMPLETED
	

PASSED
	
Example

"CREDITED"

Types
TypeQuestionnaire
Description

A type questionnaire registration.
Fields
Field Name 	Description
attachments - [Attachment] 	
audit - AuditInfo 	
booking - TypeQuestionnaireBooking 	
class - Class 	
comment - String 	
endsAt - DateTime 	Expects a date-time to be specified in ISO 8610 format.
expensesInvoiceNumber - String 	Only present if an expense invoice is filled.
groundTrainingSubject - SubjectCategory 	Will only be null if the requesting user is not allowed to read it.
id - Id! 	
instructor - User 	Will only be null if the requesting user is not allowed to read.
note - String 	
participations - [TheoryParticipation]! 	
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
subject - String 	Renamed to note
subjectCategory - SubjectCategory 	Will only be null if the requesting user is not allowed to read it. Renamed to groundTrainingSubject
Example

{
  "attachments": [Attachment],
  "audit": AuditInfo,
  "booking": TypeQuestionnaireBooking,
  "class": Class,
  "comment": "abc123",
  "endsAt": "2007-12-03T10:15:30Z",
  "expensesInvoiceNumber": "abc123",
  "groundTrainingSubject": SubjectCategory,
  "id": Id,
  "instructor": User,
  "note": "xyz789",
  "participations": [TheoryParticipation],
  "startsAt": "2007-12-03T10:15:30Z",
  "subject": "abc123",
  "subjectCategory": SubjectCategory
}

Types
TypeQuestionnaireBooking
Description

A booking for a type questionnaire.
Fields
Field Name 	Description
audit - AuditInfo 	
class - Class 	
classroom - Classroom 	The location (i.e. classroom) in which the booking will take place. Will only be null if the requesting user is not allowed to read it.
color - String 	The color of the booking (If not present we use default colors).
comment - String 	
emailNotifications - Boolean! 	Whether or not email notifications will be sent to participants when changes are made to the booking.
endsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
id - String! 	
instructor - User 	The instructor/examiner slated to oversee the booking. Will only be null if the requesting user is not allowed to read it.
startsAt - DateTime! 	Expects a date-time to be specified in ISO 8610 format.
status - BookingStatusEnum! 	The current lifecycle status of the booking.
students - [User]! 	Students slated to participate in the activity.
subject - String 	The subject or name of the theoretical activity.
theoryCourse - TheoryCourse 	Will only be null if the requesting user is not allowed to read it.
Example

{
  "audit": AuditInfo,
  "class": Class,
  "classroom": Classroom,
  "color": "abc123",
  "comment": "abc123",
  "emailNotifications": false,
  "endsAt": "2007-12-03T10:15:30Z",
  "externalReference": "xyz789",
  "id": "xyz789",
  "instructor": User,
  "startsAt": "2007-12-03T10:15:30Z",
  "status": "CANCELLED",
  "students": [User],
  "subject": "xyz789",
  "theoryCourse": TheoryCourse
}

Types
TypeQuestionnaireBookingInput
Fields
Input Field 	Description
awaitingApproval - Boolean 	When true, the booking is created as "Awaiting Approval" even if the caller has approval rights. Defaults to false (auto-approved when the caller has the approve ability).
bookingEnd - DateTime! 	
bookingStart - DateTime! 	
classroomId - ID! 	
color - String 	
comment - String 	
externalReference - String 	External reference supplied by external systems/sources for their own tracking.
instructorById - ID! 	
notifyViaEmail - Boolean 	
programId - ID 	
programRevisionId - ID 	
recurrenceRule - String 	
studentsById - [StudentInput!] 	
subject - String 	
subjectCategoryId - ID! 	
teamId - ID 	
theoryCourse - ID 	
theoryLessonId - ID 	
Example

{
  "awaitingApproval": false,
  "bookingEnd": "2007-12-03T10:15:30Z",
  "bookingStart": "2007-12-03T10:15:30Z",
  "classroomId": 4,
  "color": "abc123",
  "comment": "abc123",
  "externalReference": "xyz789",
  "instructorById": 4,
  "notifyViaEmail": true,
  "programId": 4,
  "programRevisionId": "4",
  "recurrenceRule": "xyz789",
  "studentsById": [StudentInput],
  "subject": "abc123",
  "subjectCategoryId": 4,
  "teamId": 4,
  "theoryCourse": "4",
  "theoryLessonId": "4"
}

Types
TypeQuestionnaireConnection
Description

The connection type for TypeQuestionnaire.
Fields
Field Name 	Description
edges - [TypeQuestionnaireEdge] 	A list of edges.
nodes - [TypeQuestionnaire] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [TypeQuestionnaireEdge],
  "nodes": [TypeQuestionnaire],
  "pageInfo": PageInfo
}

Types
TypeQuestionnaireEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - TypeQuestionnaire 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": TypeQuestionnaire
}

Types
User
Description

A user.
Fields
Field Name 	Description
accountingTransactions - AccountingTransactionConnection! 	Accounting transactions for this user. Paginated, newest first. Requires accounting module.
Arguments
after - String

Returns the elements in the list that come after the specified cursor.
before - String

Returns the elements in the list that come before the specified cursor.
first - Int

Returns the first n elements from the list.
from - DateTime

If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int

Returns the last n elements from the list.
to - DateTime

If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
userId - Id

Filter by user. When omitted from root query, returns all account transactions.
audit - AuditInfo 	
availabilities - UserAvailabilityConnection! 	User availability events in a given span of time.
Arguments
after - String

Returns the elements in the list that come after the specified cursor.
before - String

Returns the elements in the list that come before the specified cursor.
first - Int

Returns the first n elements from the list.
from - DateTime

If provided, will only fetch events beginning after this point in time. Defaults to beginning of current day.
last - Int

Returns the last n elements from the list.
to - DateTime

If provided, will only fetch events ending before this point in time. Defaults to end of day of from time.
avatarUrl - String! 	
bookingTimeZone - String 	The effective booking timezone for the authenticated user.
callSign - String! 	
contact - UserContact 	
emergencyContact - UserEmergencyContact 	
firstName - String 	
flightTimeZone - String 	The effective flight timezone for the authenticated user.
flights - FlightConnection! 	The flights which the user has partaken in.
Arguments
after - String

Returns the elements in the list that come after the specified cursor.
all - Boolean

If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String

Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime

If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int

Returns the first n elements from the list.
from - DateTime

If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int

Returns the last n elements from the list.
to - DateTime

If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
id - String! 	
lastName - String 	
notes - UserNotes 	
overrideTimeZone - Boolean 	Whether the authenticated user overrides the account timezone defaults.
references - UserReferences 	
theoryTimeZone - String 	The effective theory timezone for the authenticated user.
userPrograms - UserProgramConnection 	user_programs ( user programs )
Arguments
after - String

Returns the elements in the list that come after the specified cursor.
all - Boolean

If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String

Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime

If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int

Returns the first n elements from the list.
from - DateTime

If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int

Returns the last n elements from the list.
programIds - [Id!]

If provided, will only return trainings for the program with the given ID.
programType - ProgramTypeEnum

If provided, will only return programs of the type given.
status - [UserProgramEnum!]

If provided, will only return when the status is set such as Active, Standby or Completed.
to - DateTime

If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
userIds - [Id!]

If provided, will only return programs for the user with the given ID.
Example

{
  "accountingTransactions": AccountingTransactionConnection,
  "audit": AuditInfo,
  "availabilities": UserAvailabilityConnection,
  "avatarUrl": "xyz789",
  "bookingTimeZone": "xyz789",
  "callSign": "xyz789",
  "contact": UserContact,
  "emergencyContact": UserEmergencyContact,
  "firstName": "xyz789",
  "flightTimeZone": "abc123",
  "flights": FlightConnection,
  "id": "xyz789",
  "lastName": "abc123",
  "notes": UserNotes,
  "overrideTimeZone": true,
  "references": UserReferences,
  "theoryTimeZone": "xyz789",
  "userPrograms": UserProgramConnection
}

Types
UserAvailability
Description

A user availability event. Indicates the availability (or unavailability) of a user in a certain timespan.
Fields
Field Name 	Description
endsAt - DateTime! 	
startsAt - DateTime! 	
unavailable - Boolean! 	
Example

{
  "endsAt": "2007-12-03T10:15:30Z",
  "startsAt": "2007-12-03T10:15:30Z",
  "unavailable": false
}

Types
UserAvailabilityConnection
Description

The connection type for UserAvailability.
Fields
Field Name 	Description
edges - [UserAvailabilityEdge] 	A list of edges.
nodes - [UserAvailability] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [UserAvailabilityEdge],
  "nodes": [UserAvailability],
  "pageInfo": PageInfo
}

Types
UserAvailabilityEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - UserAvailability 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": UserAvailability
}

Types
UserCategory
Fields
Field Name 	Description
exercises - [UserExercise]! 	
extraExercises - [UserExtraExercise]! 	
id - Id! 	
name - String! 	
Example

{
  "exercises": [UserExercise],
  "extraExercises": [UserExtraExercise],
  "id": Id,
  "name": "xyz789"
}

Types
UserConnection
Description

The connection type for User.
Fields
Field Name 	Description
edges - [UserEdge] 	A list of edges.
nodes - [User] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [UserEdge],
  "nodes": [User],
  "pageInfo": PageInfo
}

Types
UserContact
Description

Contact information for the user.
Fields
Field Name 	Description
address - String 	
city - String 	
country - String 	
dateOfBirth - Date 	Expects a date to be specified in ISO 8610 format.
email - String! 	
gender - GenderEnum! 	Gender of the user.
phone - String 	
zipcode - String 	
Example

{
  "address": "xyz789",
  "city": "abc123",
  "country": "xyz789",
  "dateOfBirth": "2007-12-03",
  "email": "xyz789",
  "gender": "FEMALE",
  "phone": "abc123",
  "zipcode": "xyz789"
}

Types
UserEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - User 	The item at the end of the edge.
Example

{
  "cursor": "abc123",
  "node": User
}

Types
UserEmergencyContact
Description

Contact information for the emergency contact of a user.
Fields
Field Name 	Description
address - String 	
city - String 	
country - String 	
dateOfBirth - Date 	Expects a date to be specified in ISO 8610 format.
email - String 	
firstName - String 	
lastName - String 	
phone - String 	
relation - String 	
zipcode - String 	
Example

{
  "address": "xyz789",
  "city": "xyz789",
  "country": "abc123",
  "dateOfBirth": "2007-12-03",
  "email": "xyz789",
  "firstName": "xyz789",
  "lastName": "abc123",
  "phone": "xyz789",
  "relation": "abc123",
  "zipcode": "abc123"
}

Types
UserExercise
Fields
Field Name 	Description
bestGrade - String 	
carryForward - Boolean! 	
comment - String 	
flagged - Boolean! 	
grade - String 	
gradedCompetencies - [GradedCompetency] 	
id - Id! 	
name - String! 	
normGrade - String 	
Example

{
  "bestGrade": "abc123",
  "carryForward": false,
  "comment": "abc123",
  "flagged": true,
  "grade": "xyz789",
  "gradedCompetencies": [GradedCompetency],
  "id": Id,
  "name": "xyz789",
  "normGrade": "abc123"
}

Types
UserExtraExercise
Fields
Field Name 	Description
bestGrade - String 	
carryForward - Boolean! 	
comment - String 	
flagged - Boolean! 	
grade - String 	
id - Id! 	
name - String! 	
Example

{
  "bestGrade": "xyz789",
  "carryForward": false,
  "comment": "abc123",
  "flagged": true,
  "grade": "xyz789",
  "id": Id,
  "name": "abc123"
}

Types
UserInput
Fields
Input Field 	Description
address - String 	
adminNote - String 	
caaRefNum - String 	
callSign - String! 	
city - String 	
country - String 	
dateOfBirth - Date 	
email - String! 	
firstName - String! 	
gender - GenderInputEnum 	
instructorNote - String 	
lastName - String! 	
phone - String 	
placeOfBirth - String 	
postCode - String 	
publicNote - String 	
reference - String 	External reference. Used to identify the user in external systems/sources.
Example

{
  "address": "xyz789",
  "adminNote": "abc123",
  "caaRefNum": "xyz789",
  "callSign": "xyz789",
  "city": "xyz789",
  "country": "abc123",
  "dateOfBirth": "2007-12-03",
  "email": "abc123",
  "firstName": "abc123",
  "gender": "FEMALE",
  "instructorNote": "abc123",
  "lastName": "xyz789",
  "phone": "abc123",
  "placeOfBirth": "abc123",
  "postCode": "xyz789",
  "publicNote": "xyz789",
  "reference": "xyz789"
}

Types
UserNotes
Description

Note information for the user.
Fields
Field Name 	Description
adminNote - String 	
instructorNote - String 	
publicNote - String 	
Example

{
  "adminNote": "abc123",
  "instructorNote": "abc123",
  "publicNote": "xyz789"
}

Types
UserProgram
Description

Represents the link between a User and a Program.
Fields
Field Name 	Description
assignmentDate - DateTime! 	
audit - AuditInfo 	
classTheory - [TheoryParticipation]! 	
exams - [ExamParticipation]! 	
id - Id! 	
name - String! 	
program - Program 	
programRevision - ProgramRevision 	
progressTests - [TheoryParticipation]! 	
status - String! 	
theoryReleases - [TheoryParticipation]! 	
trainings - TrainingConnection 	training ( user lectures )
Arguments
after - String

Returns the elements in the list that come after the specified cursor.
all - Boolean

If true, will also resolve resources that the requesting user is not associated with, provided they have permission.
before - String

Returns the elements in the list that come before the specified cursor.
changedAfter - DateTime

If provided, finds only entries created or updated after this date. Expects a date-time to be specified in ISO 8610 format.
first - Int

Returns the first n elements from the list.
from - DateTime

If provided, finds only entries beginning after the date. Expects a date-time to be specified in ISO 8610 format.
last - Int

Returns the last n elements from the list.
programIds - [Id!]

If provided, will only return trainings for the program with the given ID.
status - [TrainingStatusEnum!]

If provided, will only return when the status is set such as Passed, failed or Completed.
to - DateTime

If provided, finds only entries ending before the date. Expects a date-time to be specified in ISO 8610 format.
userIds - [Id!]

If provided, will only return trainings associated with user ID
typeQuestionnaires - [TheoryParticipation]! 	
user - User 	
Example

{
  "assignmentDate": "2007-12-03T10:15:30Z",
  "audit": AuditInfo,
  "classTheory": [TheoryParticipation],
  "exams": [ExamParticipation],
  "id": Id,
  "name": "xyz789",
  "program": Program,
  "programRevision": ProgramRevision,
  "progressTests": [TheoryParticipation],
  "status": "xyz789",
  "theoryReleases": [TheoryParticipation],
  "trainings": TrainingConnection,
  "typeQuestionnaires": [TheoryParticipation],
  "user": User
}

Types
UserProgramConnection
Description

The connection type for UserProgram.
Fields
Field Name 	Description
edges - [UserProgramEdge] 	A list of edges.
nodes - [UserProgram] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [UserProgramEdge],
  "nodes": [UserProgram],
  "pageInfo": PageInfo
}

Types
UserProgramEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - UserProgram 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": UserProgram
}

Types
UserProgramEnum
Values
Enum Value 	Description

ACTIVE
	

COMPLETED
	

DISCONTINUED
	

STANDBY
	
Example

"ACTIVE"

Types
UserReferences
Description

Reference information for the user.
Fields
Field Name 	Description
caaRefNum - String 	
reference - String 	External reference. Used to identify the user in external systems/sources.
Example

{
  "caaRefNum": "abc123",
  "reference": "xyz789"
}

Types
UserRoleEnum
Values
Enum Value 	Description

ADMINISTRATOR
	

CREW
	

FLIGHT_INSTRUCTOR
	

GROUND_INSTRUCTOR
	

GUEST
	

INSTRUCTOR
	

RENTER
	

STAFF
	

STUDENT
	
Example

"ADMINISTRATOR"

Types
VersionEvent
Description

Fields common to all version events (i.e. creations, updates and deletions).
Fields
Field Name 	Description
entityId - Id! 	The id of the entity.
entityType - VersionableEntityEnum! 	The type of the entity.
eventType - VersionEventTypeEnum! 	The type of versioning that took place.
happenedAt - DateTime! 	The point in time at which the event took place. Expects a date-time to be specified in ISO 8610 format.
whoDoneIt - User 	The instigator of the event.
Possible Types
VersionEvent Types

Deletion
Example

{
  "entityId": Id,
  "entityType": "BOOKING",
  "eventType": "DELETION",
  "happenedAt": "2007-12-03T10:15:30Z",
  "whoDoneIt": User
}

Types
VersionEventTypeEnum
Description

All possible version events that can happen to versionable entities.
Values
Enum Value 	Description

DELETION
	
Example

"DELETION"

Types
VersionUnion
Description

Union of possible version changes of entities.
Types
Union Types

Deletion
Example

Deletion

Types
VersionUnionConnection
Description

The connection type for VersionUnion.
Fields
Field Name 	Description
edges - [VersionUnionEdge] 	A list of edges.
nodes - [VersionUnion] 	A list of nodes.
pageInfo - PageInfo! 	Information to aid in pagination.
Example

{
  "edges": [VersionUnionEdge],
  "nodes": [Deletion],
  "pageInfo": PageInfo
}

Types
VersionUnionEdge
Description

An edge in a connection.
Fields
Field Name 	Description
cursor - String! 	A cursor for use in pagination.
node - VersionUnion 	The item at the end of the edge.
Example

{
  "cursor": "xyz789",
  "node": Deletion
}

Types
VersionableEntityEnum
Description

All possible entity types of which version changes can be retrieved.
Values
Enum Value 	Description

BOOKING
	

CLASS_THEORY
	

DUTY_TIME
	

EXAM
	

EXTRA_THEORY
	

FLIGHT
	

OPERATION
	

PROGRESS_TEST
	

RENTAL
	

THEORY_RELEASE
	

TRAINING
	

TYPE_QUESTIONNAIRE
	

USER_PROGRAM