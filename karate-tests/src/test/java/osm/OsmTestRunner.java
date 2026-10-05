package osm;

import com.intuit.karate.junit5.Karate;

class OsmTestRunner {

    @Karate.Test
    Karate testOsmCrud() {
        return Karate.run().relativeTo(getClass());
    }
}