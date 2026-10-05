Feature: OSM Development Server — Location CRUD

  Background:
    * url baseUrl
    # Bearer token is set globally in karate-config.js, but can be overridden per scenario if needed
    # Helper functions to store and retrieve state across isolated scenarios
    * def setVar = function(k, v){ java.lang.System.setProperty(k, v + '') }
    * def getVar = function(k){ return java.lang.System.getProperty(k) }

  Scenario: 00 - Invalid token returns 401
    # Explicitly set invalid token in configure headers for this scenario
    * configure headers = { Authorization: 'Bearer deliberately-invalid-token', 'Accept-Encoding': 'gzip' }
    Given path 'api', '0.6', 'user', 'details.json'
    When method get
    Then status 401

  Scenario: 01 - Create changeset
    Given path 'api', '0.6', 'changeset', 'create'
    And header Content-Type = 'application/xml'
    And request
    """
    <osm>
      <changeset>
        <tag k="created_by" v="Karate OSM API test"/>
        <tag k="comment" v="#('Ephemeral automated location CRUD test ' + testRunId)"/>
      </changeset>
    </osm>
    """
    When method put
    Then status 200
    And match response == '#regex ^\\d+$'
    * setVar('changeset_id', response.trim())

  Scenario: 02 - Create location node
    * def changesetId = getVar('changeset_id')
    Given path 'api', '0.6', 'nodes'
    And header Content-Type = 'application/xml'
    And request
    """
    <osm>
      <node changeset="#(changesetId)" lat="12.971600" lon="77.594600">
        <tag k="name" v="Karate test point"/>
        <tag k="source" v="automated-test"/>
        <tag k="test_run" v="#(testRunId)"/>
      </node>
    </osm>
    """
    When method post
    Then status 200
    And match response == '#regex ^\\d+$'
    * setVar('node_id', response.trim())
    * setVar('node_version', '1')

  Scenario: 03 - Read location node
    * def nodeId = getVar('node_id')
    Given path 'api', '0.6', 'node', nodeId + '.json'
    When method get
    Then status 200
    And match response.elements[0].id == parseInt(nodeId)
    And match response.elements[0].lat == 12.9716
    And match response.elements[0].lon == 77.5946
    * setVar('node_version', response.elements[0].version)

  Scenario: 04 - Update location node
    * def nodeId = getVar('node_id')
    * def nodeVersion = getVar('node_version')
    * def changesetId = getVar('changeset_id')
    Given path 'api', '0.6', 'node', nodeId
    And header Content-Type = 'application/xml'
    And request
    """
    <osm>
      <node id="#(nodeId)" version="#(nodeVersion)" changeset="#(changesetId)" lat="12.975000" lon="77.599000">
        <tag k="name" v="Karate test point — updated"/>
        <tag k="source" v="automated-test"/>
        <tag k="test_run" v="#(testRunId)"/>
      </node>
    </osm>
    """
    When method put
    Then status 200
    And match response == '#regex ^\\d+$'
    * setVar('node_version', response.trim())

  Scenario: 05 - Verify updated node
    * def nodeId = getVar('node_id')
    Given path 'api', '0.6', 'node', nodeId + '.json'
    When method get
    Then status 200
    And match response.elements[0].lat == 12.975
    And match response.elements[0].lon == 77.599
    And match response.elements[0].tags.name == 'Karate test point — updated'
    * setVar('node_version', response.elements[0].version)

  Scenario: 06 - Invalid coordinates return 400
    * def changesetId = getVar('changeset_id')
    Given path 'api', '0.6', 'nodes'
    And header Content-Type = 'application/xml'
    And request
    """
    <osm>
      <node changeset="#(changesetId)" lat="91" lon="181">
        <tag k="source" v="automated-test"/>
      </node>
    </osm>
    """
    When method post
    Then status 400

  Scenario: 07 - Delete location node
    * def nodeId = getVar('node_id')
    * def nodeVersion = getVar('node_version')
    * def changesetId = getVar('changeset_id')
    Given path 'api', '0.6', 'node', nodeId
    And header Content-Type = 'application/xml'
    And request
    """
    <osm>
      <node id="#(nodeId)" version="#(nodeVersion)" changeset="#(changesetId)" lat="12.975000" lon="77.599000"/>
    </osm>
    """
    When method delete
    Then status 200

  Scenario: 08 - Close changeset
    * def changesetId = getVar('changeset_id')
    Given path 'api', '0.6', 'changeset', changesetId, 'close'
    When method put
    Then status 200