package org.example;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import testrunner.TestLifecycleLogger;
import testrunner.score;
import static org.junit.jupiter.api.Assertions.*;

public class TestLinkedList implements TestLifecycleLogger{
    public ObjectList linkedList;

    @BeforeEach
    void setUp(){
        linkedList = new ObjectList();
    }

    @score(5)
    @Test
    void checkSize() {
        linkedList.addFirst(1);
        linkedList.addFirst(2);
        linkedList.addFirst(3);
        assertEquals(4, linkedList.size());
    }

    @score(10)
    @Test
    void add() {
        linkedList.addFirst(1);
        assertEquals(1, linkedList.size());
    }

    @score(15)
    @Test
    void checkReverse(){
        linkedList.addFirst(1);
        linkedList.addFirst(2);
        linkedList.reverse();
        assertEquals(1, linkedList.removeFirst());
    }
}
