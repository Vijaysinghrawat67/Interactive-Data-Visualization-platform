import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-background text-foreground py-16 px-4 sm:px-8 lg:px-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Got a question, feedback, or need help? We're here to listen and assist you.
        </p>
      </motion.div>

      {/* Info and Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <Card className="bg-muted p-6">
            <CardContent className="flex items-center gap-4">
              <FaEnvelope className="text-xl text-primary" />
              <div>
                <h3 className="text-lg font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">support@datavizapp.com</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted p-6">
            <CardContent className="flex items-center gap-4">
              <FaPhoneAlt className="text-xl text-primary" />
              <div>
                <h3 className="text-lg font-medium">Phone</h3>
                <p className="text-sm text-muted-foreground">+1 234 567 890</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted p-6">
            <CardContent className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-xl text-primary" />
              <div>
                <h3 className="text-lg font-medium">Address</h3>
                <p className="text-sm text-muted-foreground">123 Data St, Tech City, World 45678</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-6">
            <CardContent className="space-y-6">
              <Input type="text" placeholder="Your Name" className="w-full" />
              <Input type="email" placeholder="Your Email" className="w-full" />
              <Textarea placeholder="Your Message" className="w-full h-32 resize-none" />
              <Button className="w-full bg-primary hover:bg-primary/90 transition duration-300">
                Send Message
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
