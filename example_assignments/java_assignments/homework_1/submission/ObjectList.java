package org.example;

/**
 * <h2> ObjectList.java - </h2>
 * <p>Problem Statement: write a Java program that focuses on the manipulation of linear
 *                       linked lists and their associated classes</p>
 * @author Angel Samora / Student ID: 011746317
 * @version 4/22/20
 */
public class ObjectList implements ObjectListInterface{
    private ObjectListNode list;
    private ObjectListNode last;
    /**
     * No-arg constructor that creates an empty list
     */
    public ObjectList() {
        list = null;
        last = null;
    }
    /**
     * Public ObjectListNode getFirstNode method tdhat returns the first
     * node in the list
     * @return list
     */
    public ObjectListNode getFirstNode() {
        return list;
    }
    /**
     * Public ObjectListNode getLastNode method that returns the last node
     * in the list
     * @return last;
     */
    public ObjectListNode getLastNode() {
        return last;
    }
    /**
     * Public Object getFirst method that returns the first object
     * in the list
     * @return Object
     */
    public Object getFirst() {
        if (list == null) {
            System.out.println("Runtime Error: getFirst()");
            System.exit(1);
        }
        return list.getInfo();
    }
    /**
     * Public Object getLast method that returns the last object
     * in the list
     * @return Object
     */
    public Object getLast() {
        if (list == null) {
            System.out.println("Runtime Error: getLast()");
            System.exit(1);
        }
        return last.getInfo();
    }
    /**
     * Public void addFirst method that adds an object
     * to the front of the list
     * @param Object o
     */
    public void addFirst(Object o) {
        ObjectListNode p = new ObjectListNode(o, list);
        if (list == null)
            last = p;
        list = p;
    }
    /**
     * Public void addFirst method that adds a node to the front of
     * the list
     * @param ObjectListNode p
     */
    public void addFirst(ObjectListNode p) {
        if (p == null) {
            System.out.println("Runtime Error: addFirst()");
            System.exit(1);
        }
        p.setNext(list);
        if (list == null)
            last = p;
        list = p;
    }
    /**
     * Public void addLast method that adds an object to the end
     * of the list
     * @param Object o
     */
    public void addLast(Object o) {
        ObjectListNode p = new ObjectListNode(o);
        if (list == null)
            list = p;
        else
            last.setNext(p);
        last = p;
    }
    /**
     * Public void addLast method that adds a node to the end
     * of the list
     * @param ObjectListNode p
     */
    public void addLast(ObjectListNode p) {
        if (p == null) {
            System.out.println("Runtime Error: addLast()");
            System.exit(1);
        }
        p.setNext(null);
        if (list == null)
            list = p;
        else
            last.setNext(p);
        last = p;
    }
    /**
     * Public Object removeFirst method that removes the first object
     * from the list
     * @return Object
     */
    public Object removeFirst() {
        if (list == null) {
            System.out.println("Runtime Error: removeFirst()");
            System.exit(1);
        }
        ObjectListNode p = list;
        list = p.getNext();
        if (list == null)
            last = null;
        return p.getInfo();
    }
    /**
     * Public Object removeLast method that removes the last Object from
     * the list
     * @return Object
     */
    public Object removeLast() {
        if (list == null) {
            System.out.println("Runtime Error: removeLast()");
            System.exit(1);
        }
        ObjectListNode p = list;
        ObjectListNode q = null;
        while (p.getNext() != null) {
            q = p;
            p = p.getNext();
        }
        if (q == null) {
            list = null;
            last = null;
        }
        else {
            q.setNext(null);
            last = q;
        }
        return p.getInfo();
    }
    /**
     * Public void insertAfter method that inserts an object after the node
     * referenced by p
     * @param ObjectListNode p
     * @param Object o
     */
    public void insertAfter (ObjectListNode p, Object o) {
        if (list == null || p == null) {
            System.out.println("Runtime Error: insertAfter()");
            System.exit(1);
        }
        ObjectListNode q = new ObjectListNode(o, p.getNext());
        p.setNext(q);
        if (q.getNext() == null)
            last = q;
    }
    /**
     * Public void insertAfter method that inserts a node after
     * the node referenced by p
     * @param ObjectListNode p
     * @param ObjectListNode q
     */
    public void insertAfter(ObjectListNode p, ObjectListNode q) {
        if (list == null || p == null || q == null) {
            System.out.println("Runtime Error: insertAfter()");
            System.exit(1);
        }
        q.setNext(p.getNext());
        p.setNext(q);
        if (last.getNext() != null)
            last = q;
    }
    /**
     * Public Object deleteAfter method that deletes the node
     * after the node referenced by p
     * @param ObjectListNode p
     * @return Object
     */
    public Object deleteAfter(ObjectListNode p) {
        if (list == null || p == null || p.getNext() == null) {
            System.out.println("Runtime Error: deleteAfter()");
            System.exit(1);
        }
        ObjectListNode q = p.getNext();
        p.setNext(q.getNext());
        if (p.getNext() == null)
            last = p;
        return q.getInfo();
    }
    /**
     * Public void insert method that inserts an item into its correct location
     * within an ordered list
     * @param Object o
     */
    public void insert(Object o) {
        ObjectListNode p = list;
        ObjectListNode q = null;
        while (p != null && ((Comparable)o).compareTo(p.getInfo()) > 0) {
            q = p;
            p = p.getNext();
        }
        if (q == null)
            addFirst(o);
        else
            insertAfter(q, o);
    }
    /**
     * Public void insert method that inserts a node into its correct location within
     * an ordered list
     * @param ObjectListNode r
     */
    public void insert(ObjectListNode r) {
        ObjectListNode p = list;
        ObjectListNode q = null;
        while (p != null &&
                ((Comparable)r.getInfo()).compareTo(p.getInfo()) > 0) {
            q = p;
            p = p.getNext();
        }
        if (q == null)
            addFirst(r);
        else
            insertAfter(q, r);
    }
    /**
     * Public Object remove method that removes the first occurence
     * of an item in a list
     * @param Object o
     * @return Object
     */
    public Object remove(Object o) {
        ObjectListNode p = list;
        ObjectListNode q = null;
        while (p != null && ((Comparable)o).compareTo(p.getInfo()) != 0) {
            q = p;
            p = p.getNext();
        }
        if (p == null)
            return null;
        else return q == null ? removeFirst() : deleteAfter(q);
    }
    /**
     * Public boolean contains method that returns true if the item is found
     * in the list
     * @param Object o
     * @return boolean
     */
    public boolean contains(Object o) {
        ObjectListNode p = list;
        while (p != null && ((Comparable)o).compareTo(p.getInfo()) !=
                0)
            p = p.getNext();
        return p != null;
    }
    /**
     * Public ObjectListNode select method that returns a reference to the node with
     * the requested value, returns a null otherwise
     * @param Object o
     * @return ObjectListNode
     */
    public ObjectListNode select(Object o) {
        ObjectListNode p = list;
        while (p != null)
            if (((Comparable)o).compareTo(p.getInfo()) == 0)
                return p;
            else
                p = p.getNext();
        return null;
    }
    /**
     * Public boolean isEmpty method that returns true or false
     * depending if the list is empty
     * @return boolean
     */
    public boolean isEmpty() {
        return list == null;
    }
    /**
     * Public void clear method that removes all the elements in the list
     */
    public void clear() {
        list = null;
        last = null;
    }
    /**
     * Public int side method that returns the number of elements in the list
     * @return int
     */
    public int size() {
        int count = 0;
        ObjectListNode p = list;
        while (p != null) {
            ++count;
            p = p.getNext();
        }
        return count;
    }
    /**
     * Public ObjectList copyList method that makes a copy of the list
     * @return ObjectList
     */
    public ObjectList copyList() {
        ObjectListNode p = null;
        ObjectListNode q = null; // to satisfy compiler;
        ObjectListNode r = list;

        if (isEmpty())
            return null;
        ObjectList newList = new ObjectList();
        while (r != null) {
            p = new ObjectListNode(r.getInfo());
            if (newList.isEmpty())
                newList.addFirst(p);
            else
                q.setNext(p);
            q = p;
            r = r.getNext();
        }
        newList.last = p;
        return newList;
    }
    /**
     * Public void reverse method that reverses a list
     */
    public void reverse() {
        ObjectListNode p = list;
        ObjectListNode q = null;
        ObjectListNode r;

        while (p != null) {
            r = q;
            q = p;
            p = p.getNext();
            q.setNext(r);
        }
        last = list;
        list = q;
    }
}
