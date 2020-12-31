// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Deque;
import java.util.List;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    // Cases
    // Options for no attendees - should be available all day.
    if (request.getAttendees().isEmpty()) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }
    // Duration longer than a day will return empty array.
    if (request.getDuration() > TimeRange.getTimeInMinutes(23, 59)) {
      return Arrays.asList();
    }
    // Check if there are availabilities for all attendees
    List<String> attendees = new ArrayList<>();
    attendees.addAll(request.getAttendees());
    attendees.addAll(request.getOptionalAttendees());
    Collection<TimeRange> allAttendeesAvailabilities = findAvailability(events, request, attendees);

    // If there are no available timeslots for all attendees including optional attendees,
    // Find availabilities for the mandatory attendees.
    if (allAttendeesAvailabilities.isEmpty()) {
      return findAvailability(events, request, request.getAttendees());
    }

    return allAttendeesAvailabilities;
  }

  /** Private helper method to find all availabilities of people from the request. */
  private Collection<TimeRange> findAvailability(
      Collection<Event> events, MeetingRequest request, Collection<String> attendees) {
    // Find all the unavailable times of the attendees.
    List<TimeRange> unavailabilities = new ArrayList<>();
    for (Event event : events) {
      if (!Collections.disjoint(attendees, event.getAttendees())) {
        unavailabilities.add(event.getWhen());
      }
    }
    // If there are no unavailable times, return whole day.
    if (unavailabilities.isEmpty()) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }
    List<TimeRange> mergedUnavailabilities = mergeAllUnavailabilities(unavailabilities);
    mergedUnavailabilities.sort(TimeRange.ORDER_BY_START);
    // Find all available times by checking if gaps between busy time ranges are greater than the
    // duration.
    List<TimeRange> availabilities = new ArrayList<>();
    int start = TimeRange.START_OF_DAY;
    long duration = request.getDuration();
    for (TimeRange interval : mergedUnavailabilities) {
      if (interval.start() - start >= duration) {
        availabilities.add(TimeRange.fromStartEnd(start, interval.start(), false));
      }
      start = interval.end();
    }
    // Check if there is a lot between there and the end of the day.
    if (TimeRange.END_OF_DAY - start >= duration) {
      availabilities.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
    }
    return availabilities;
  }

  /**
   * Private helper method using ArrayDeque to merge overlapping time ranges from an ArrayList.
   * Merging code from https://www.geeksforgeeks.org/merging-intervals/
   */
  private List<TimeRange> mergeAllUnavailabilities(List<TimeRange> unavailabilities) {
    Deque<TimeRange> unavailabilitiesStack = new ArrayDeque<>();
    unavailabilities.sort(TimeRange.ORDER_BY_START);

    // Push the first unavaibility into the Deque.
    unavailabilitiesStack.push(unavailabilities.get(0));

    // Start from the next unavailability and merge if necessary.
    for (int i = 1; i < unavailabilities.size(); i++) {
      TimeRange top = unavailabilitiesStack.peek();

      TimeRange currentRange = unavailabilities.get(i);
      // If current time range is not overlapping with the top, push it to the stack.
      if (!top.overlaps(currentRange)) {
        unavailabilitiesStack.push(currentRange);
      } else if (top.contains(currentRange)) {
        continue;
      } else {
        unavailabilitiesStack.pop();
        unavailabilitiesStack.push(TimeRange.fromStartEnd(top.start(), currentRange.end(), false));
      }
    }
    // Change from Deque to Array then return the Array as a List.
    TimeRange[] arr = unavailabilitiesStack.toArray(new TimeRange[0]);
    return Arrays.asList(arr);
  }
}
