#!/bin/bash
# RealNest Backend Startup Script
export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || echo "/opt/homebrew/Cellar/openjdk@17/17.0.18/libexec/openjdk.jdk/Contents/Home")
echo "Using JAVA_HOME: $JAVA_HOME"
cd "$(dirname "$0")"
mvn spring-boot:run
