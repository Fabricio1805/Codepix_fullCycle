package main

import (
	"os"

	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/application/grpc"
	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/infrastructure/db"
	"github.com/jinzhu/gorm"
)

var database *gorm.DB

func main() {
	database = db.ConnectDB(os.Getenv("env"))

	grpc.StartGrpcServer(database, 50051)
}