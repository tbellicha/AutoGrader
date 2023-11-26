package org.example;

/**
 * <h2> ObjectListNode.java - </h2>
 * <p>Problem Statement: write a Java program that focuses on the manipulation of linear
 *                       linked lists and their associated classes</p>
 * @author Angel Samora / Student ID: 011746317
 * @version 4/22/20
 */
public class ObjectListNode implements ObjectListNodeInterface {
    private Object info;
    private ObjectListNode next;
    /**
     * Public no-arg constructor
     */
    public ObjectListNode() {
        info = null;
        next = null;
    }
    /**
     * Public 1-arg constructor
     * @param Object o
     */
    public ObjectListNode (Object o) {
        info = o;
        next = null;
    }
    /**
     * Public 2-arg constructor
     * @param Object o
     * @param ObjectListNode p
     */
    public ObjectListNode (Object o, ObjectListNode p) {
        info = o;
        next = p;
    }
    /**
     * Public void setInfo method that sents the info field
     * @param Object o
     */
    public void setInfo(Object o) {
        info = o;
    }
    /**
     * Public Object getInfo method that returns the object in the
     * info field
     * @return info
     */
    public Object getInfo() {
        return info;
    }
    /**
     * Public void setNext method that sets the next field
     * @param ObjectListNode p
     */
    public void setNext(ObjectListNode p) {
        next = p;
    }
    /**
     * Public ObjectListNode getNext method that returns the reference to the next
     * node in the list
     * @return next
     */
    public ObjectListNode getNext() {
        return next;
    }
}
