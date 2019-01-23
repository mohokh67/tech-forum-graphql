const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = require('graphql');

const axios = require('axios');

const apiEndpointLaunches = 'https://api.spacexdata.com/v3/launches';
const apiEndpointRockets = 'https://api.spacexdata.com/v3/rockets';

const RocketType = new GraphQLObjectType({
  name: 'Rocket',
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString },
    first_flight: { type: GraphQLString },
    description: { type: GraphQLString },
    wikipedia: { type: GraphQLString },
    active: { type: GraphQLBoolean }
  })
});

const LinkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    mission_patch: { type: GraphQLString },
    wikipedia: { type: GraphQLString },
    video_link: { type: GraphQLString }
  })
});

// https://api.spacexdata.com/v3/launches
const LaunchType = new GraphQLObjectType({
  name: 'Launch',
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLInt },
    launch_success: { type: GraphQLBoolean },
    details: { type: GraphQLString },
    links: { type: LinkType }, // relationship
    rocket: { type: RocketType } // relationship
  })
});

// Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        return axios.get(apiEndpointLaunches).then(res => res.data);
      }
    },

    // {
    //   launch(flight_number: 3) {
    //     mission_name
    //   }
    // }
    launch: {
      type: LaunchType,
      args: {
        flight_number: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return axios
          .get(`${apiEndpointLaunches}/${args.flight_number}`)
          .then(res => res.data);
      }
    },

    rockets: {
      type: new GraphQLList(RocketType),
      resolve(parent, args) {
        return axios.get(apiEndpointRockets).then(res => res.data);
      }
    },

    // {
    //   rocket(rocket_id: "falcon1") {
    //     rocket_name,
    //     description,
    //     active
    //   }
    // }
    rocket: {
      type: RocketType,
      args: {
        rocket_id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(`${apiEndpointRockets}/${args.rocket_id}`)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
