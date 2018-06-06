"use strict";

var dateParts = {
    "day": {
        select: function(value, pattern) {

        },

        add: function(value, count) {
            var current = value.getDay();
            return new Date(value.setDate(current + count));
        }
    },

    "month": {
        add: function(value, count) {
            var current = value.getMonth();
            return new Date(value.setMonth(current + count));
        }
    },

    "year": {
        add: function(value, count) {
            var current = value.getFullYear();
            return new Date(value.setFullYear(current + count));
        }
    },

    "hour": {
        add: function(value, count) {
            var current = value.getHour();
            return new Date(value.getHour(current + count));
        }
    },

    "minute": {
        add: function(value, count) {
            var current = value.getMinute();
            return new Date(value.getMinute(current + count));
        }
    }
};

exports.dateParts = dateParts;
